import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] POST /api/mpesa/callback - Kopo Kopo webhook received`);

  try {
    const body = await request.json();
    console.log(`[${requestId}] Callback payload:`, JSON.stringify(body, null, 2));

    const resource = body?.data?.attributes?.event?.resource;

    if (!resource) {
      console.error(`[${requestId}] Callback missing resource payload`);
      return NextResponse.json({ success: true });
    }

    const {
      reference: orderId,
      status,
      sender_phone_number,
      transaction_reference,
    } = resource;

    if (!orderId) {
      console.error(`[${requestId}] Callback missing order reference`);
      return NextResponse.json({ success: true });
    }

    // Only mark as paid when the terminal status is "Success" AND a receipt exists
    const isSuccessful = status === "Success" && !!transaction_reference;
    const isFailed = status === "Failed";

    // Ignore non-terminal statuses (e.g., "Received")
    if (!isSuccessful && !isFailed) {
      console.log(`[${requestId}] Non-terminal status "${status}" — no DB update`);
      return NextResponse.json({ success: true });
    }

    await connectDB();

    const updated = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          paymentStatus: isSuccessful ? "paid" : "failed",
          mpesaReceipt: transaction_reference || null,
          senderPhone: sender_phone_number || null,
          paymentDate: isSuccessful ? new Date() : null,
          kopoKopoReference: body?.data?.id || null,
          ...(isSuccessful && { status: "Processed" }),
        },
      },
      { new: true }
    );

    if (!updated) {
      console.error(`[${requestId}] Order not found for reference: ${orderId}`);
      return NextResponse.json({ success: true });
    }

    console.log(
      `[${requestId}] Order ${orderId} updated — paymentStatus: ${updated.paymentStatus}`
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`[${requestId}] Callback processing error:`, error);
    return NextResponse.json({ success: true });
  }
}