// app/api/mpesa/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(
    `[${requestId}] POST /api/mpesa/callback - Kopo Kopo webhook received`
  );

  try {
    const body = await request.json();

    // Log the full payload for debugging (Kopo Kopo sends small payloads)
    console.log(
      `[${requestId}] Callback payload:`,
      JSON.stringify(body, null, 2)
    );

    // ---- Extract the resource from the Kopo Kopo webhook structure ----
    // Two known shapes exist depending on the event type:
    //   body.data.attributes.event.resource   (payment result events)
    //   body.data.attributes.resource         (legacy/alternative)
    const resource =
      body?.data?.attributes?.event?.resource ||
      body?.data?.attributes?.resource;

    if (!resource) {
      console.error(`[${requestId}] Callback missing resource payload`);
      // Always return 200 — Kopo Kopo retries on non-2xx
      return NextResponse.json({ success: true, ignored: "no_resource" });
    }

    const {
      reference: orderId,
      status,
      sender_phone_number,
      transaction_reference,
    } = resource;

    if (!orderId) {
      console.error(`[${requestId}] Callback missing order reference`);
      return NextResponse.json({ success: true, ignored: "no_reference" });
    }

    console.log(`[${requestId}] Order ${orderId} status="${status}"`);

    // ---- Classify terminal vs non-terminal states ----
    // "Success" with a receipt  → paid
    // "Failed"                  → failed
    // Anything else             → ignore (still processing)
    const isSuccessful = status === "Success" && !!transaction_reference;
    const isFailed = status === "Failed";

    if (!isSuccessful && !isFailed) {
      console.log(
        `[${requestId}] Non-terminal status "${status}" — no DB update`
      );
      return NextResponse.json({ success: true, ignored: "non_terminal" });
    }

    await connectDB();

    // ---- Idempotency: skip if this order is already paid/failed ----
    const existing = await Order.findById(orderId)
      .select("paymentStatus mpesaReceipt")
      .lean();

    if (!existing) {
      console.error(`[${requestId}] Order not found: ${orderId}`);
      // Return 200 so Kopo Kopo doesn't keep retrying
      return NextResponse.json({ success: true, ignored: "order_not_found" });
    }

    if (
      existing.paymentStatus === "paid" ||
      existing.paymentStatus === "failed"
    ) {
      console.log(
        `[${requestId}] Order ${orderId} already in terminal state ` +
          `("${existing.paymentStatus}") — skipping update`
      );
      return NextResponse.json({ success: true, ignored: "already_processed" });
    }

    // ---- Update the order with the payment result ----
    const update: Record<string, unknown> = {
      paymentStatus: isSuccessful ? "paid" : "failed",
      mpesaReceipt: transaction_reference || null,
      senderPhone: sender_phone_number || null,
      paymentDate: isSuccessful ? new Date() : null,
      kopoKopoReference: body?.data?.id || null,
    };

    // Only advance the fulfillment status on successful payment
    if (isSuccessful) {
      update.status = "Processed";
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { $set: update },
      { new: true }
    );

    if (!updated) {
      console.error(
        `[${requestId}] Order ${orderId} update returned null unexpectedly`
      );
      return NextResponse.json({ success: true, ignored: "update_failed" });
    }

    console.log(
      `[${requestId}] Order ${orderId} updated — ` +
        `paymentStatus=${updated.paymentStatus}, ` +
        `mpesaReceipt=${updated.mpesaReceipt}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[${requestId}] Callback processing error:`, error);
    // Always return 200 so Kopo Kopo acknowledges receipt and stops retrying
    return NextResponse.json({ success: true, error: "processing_error" });
  }
}