// app/api/mpesa/stk-push/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { initiateStkPush } from "@/lib/daraja";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { paymentAccessTokenMatches } from "@/lib/order-payment-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KENYAN_PHONE_REGEX = /^(?:254|\+254|0)?([17]\d{8})$/;

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] POST /api/mpesa/stk-push - Request started`);

  try {
    const body = await request.json();
    const { phone, amount, orderId, paymentAccessToken } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing required field: orderId" },
        { status: 400 }
      );
    }

    if (typeof orderId !== "string" || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    await connectDB();
    const order = await Order.findById(orderId).select("+paymentAccessTokenHash");
    if (!order || order.paymentMethod !== "M-Pesa") {
      return NextResponse.json({ error: "M-Pesa order not found." }, { status: 404 });
    }
    if (!paymentAccessTokenMatches(paymentAccessToken, order.paymentAccessTokenHash)) {
      return NextResponse.json({ error: "Invalid order payment access." }, { status: 403 });
    }
    if (order.paymentStatus !== "pending" || order.checkoutRequestId) {
      return NextResponse.json({ error: "This order is not awaiting a new payment." }, { status: 409 });
    }

    await Order.updateOne(
      { _id: orderId, paymentStatus: "pending" },
      { $set: { paymentStatus: "pending" } }
    );

    const phoneNumber = typeof phone === "string" ? phone.replace(/\s+/g, "") : "";
    if (!KENYAN_PHONE_REGEX.test(phoneNumber)) {
      return NextResponse.json(
        { error: "The order has an invalid Kenyan phone number." },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    const orderAmount = Math.round(order.amount ?? order.total);
    if (!Number.isSafeInteger(numericAmount) || numericAmount < 1 || numericAmount !== orderAmount) {
      return NextResponse.json({ error: "Invalid order total." }, { status: 400 });
    }
    if (phoneNumber !== order.phone.replace(/\s+/g, "")) {
      return NextResponse.json({ error: "Phone number does not match the order." }, { status: 400 });
    }

    const callbackUrl = process.env.MPESA_CALLBACK_URL ||
      (process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/mpesa/callback`
        : "");
    if (!callbackUrl || !callbackUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "Set MPESA_CALLBACK_URL to a public HTTPS callback URL." },
        { status: 500 }
      );
    }

    console.log(`[${requestId}] Initiating STK Push:`, {
      amount: Math.round(numericAmount),
      orderId,
      callbackUrl,
    });

    const result = await initiateStkPush(
      phoneNumber,
      Math.round(numericAmount),
      orderId,
      callbackUrl
    );

    if (!result.success) {
      console.error(`[${requestId}] STK push failed:`, result.error);
      return NextResponse.json(
        { error: result.error || "Failed to initiate payment" },
        { status: 502 }
      );
    }

    // Extract CheckoutRequestID from Daraja response
    const checkoutRequestId = result.data?.CheckoutRequestID;

    if (!checkoutRequestId) {
      console.error(`[${requestId}] No CheckoutRequestID in response`);
      return NextResponse.json(
        { error: "Payment initiated but no request ID returned." },
        { status: 502 }
      );
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, paymentStatus: "pending", checkoutRequestId: null },
      { $set: { checkoutRequestId } },
      { new: true }
    );
    if (!updatedOrder) {
      console.error(`[${requestId}] Could not persist checkout request for order ${orderId}`);
      return NextResponse.json(
        { error: "Payment request was sent but could not be linked to the order. Contact support before retrying." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutRequestId,
      message: "STK push sent, awaiting confirmation",
    });
  } catch (error) {
    console.error(`[${requestId}] STK Push API error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}