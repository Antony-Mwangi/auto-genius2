// app/api/mpesa/stk-push/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { initiateStkPush } from "@/lib/kopokopo";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Kenyan mobile phone number validator.
 * Accepts: 07XXXXXXXX, 01XXXXXXXX, 254XXXXXXXXX, +254XXXXXXXXX,
 *          7XXXXXXXX, 1XXXXXXXX
 */
const KENYAN_PHONE_REGEX = /^(?:254|\+254|0)?([17]\d{8})$/;

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] POST /api/mpesa/stk-push - Request started`);

  try {
    const body = await request.json();
    const { phoneNumber, amount, orderId } = body;

    // ---- Validate required fields ----
    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields: phoneNumber, amount, orderId" },
        { status: 400 }
      );
    }

    // ---- Validate phone number ----
    if (
      typeof phoneNumber !== "string" ||
      !KENYAN_PHONE_REGEX.test(phoneNumber.replace(/\s+/g, ""))
    ) {
      return NextResponse.json(
        { error: "Invalid phone number. Use format like 0712345678." },
        { status: 400 }
      );
    }

    // ---- Validate amount ----
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return NextResponse.json(
        { error: "Amount must be a number of at least 1 KES." },
        { status: 400 }
      );
    }

    // ---- Validate orderId ----
    if (
      typeof orderId !== "string" ||
      !mongoose.Types.ObjectId.isValid(orderId)
    ) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    // ---- Build callback URL ----
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      console.error(`[${requestId}] NEXT_PUBLIC_APP_URL is not set`);
      return NextResponse.json(
        { error: "Server misconfiguration: missing app URL." },
        { status: 500 }
      );
    }
    const callbackUrl = `${baseUrl}/api/mpesa/callback`;

    console.log(`[${requestId}] Initiating STK Push:`, {
      phoneNumber,
      amount: Math.round(numericAmount),
      orderId,
      callbackUrl,
    });

    // ---- Call the Kopo Kopo SDK wrapper ----
    const result = await initiateStkPush(
      phoneNumber,
      Math.round(numericAmount),
      orderId,
      callbackUrl
    );

    if (!result.success || !result.location) {
      console.error(
        `[${requestId}] STK push failed:`,
        result.error || "no location returned"
      );
      return NextResponse.json(
        { error: result.error || "Failed to initiate payment" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      location: result.location,
      message: "STK Push sent. Please check your phone and enter your PIN.",
    });
  } catch (error) {
    console.error(`[${requestId}] STK Push API error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}