import { NextResponse, type NextRequest } from "next/server";
import { initiateStkPush } from "@/lib/kopokopo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] POST /api/mpesa/stk-push - Request started`);

  try {
    const body = await request.json();
    const { phoneNumber, amount, orderId } = body;

    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields: phoneNumber, amount, orderId" },
        { status: 400 }
      );
    }

    // Validate Kenyan phone number
    const phoneRegex = /^(?:254|\+254|0)?(7\d{8}|1\d{8})$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone number. Use format like 0712345678." },
        { status: 400 }
      );
    }

    if (amount < 1) {
      return NextResponse.json(
        { error: "Amount must be at least 1 KES." },
        { status: 400 }
      );
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`;

    console.log(`[${requestId}] Initiating STK Push:`, {
      phoneNumber,
      amount,
      orderId,
      callbackUrl,
    });

    const result = await initiateStkPush(phoneNumber, amount, orderId, callbackUrl);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to initiate payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      location: result.location,
      message: "STK Push sent. Please check your phone and enter your PIN.",
    });
  } catch (error: any) {
    console.error(`[${requestId}] STK Push API error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}