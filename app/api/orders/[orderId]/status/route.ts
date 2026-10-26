import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { paymentAccessTokenMatches } from "@/lib/order-payment-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const accessToken = request.headers.get("x-order-payment-token");

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID." }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId)
      .select("paymentStatus mpesaReceipt generatedReceipt +paymentAccessTokenHash")
      .lean();

    if (!order || !paymentAccessTokenMatches(accessToken, order.paymentAccessTokenHash)) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const status = order.paymentStatus === "unpaid" ? "pending" : order.paymentStatus;
    return NextResponse.json(
      {
        orderId,
        status,
        mpesaReceipt: order.mpesaReceipt,
        generatedReceipt: order.generatedReceipt,
      },
      { headers: { "Cache-Control": "no-store, must-revalidate" } }
    );
  } catch (error) {
    console.error("Order payment status lookup failed:", error);
    return NextResponse.json({ error: "Failed to fetch order status." }, { status: 500 });
  }
}