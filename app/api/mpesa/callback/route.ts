// app/api/mpesa/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { normalizePhone } from "@/lib/daraja";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CallbackMetadataItem {
  Name: string;
  Value?: string | number;
}

interface StkCallback {
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc?: string;
  CallbackMetadata?: { Item?: CallbackMetadataItem[] };
}

function accepted() {
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}

/**
 * Accepts the asynchronous Safaricom STK callback. ResultCode 0 confirms a
 * successful payment; 1032 means the customer cancelled the prompt; any other
 * non-zero ResultCode marks the payment failed. The STK Push response itself
 * is only an acceptance acknowledgement and is never used to mark an order paid.
 */
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] Daraja callback received`);

  try {
    const body = await request.json();
    // Daraja callback structure:
    // {
    //   Body: {
    //     stkCallback: {
    //       MerchantRequestID: "...",
    //       CheckoutRequestID: "...",
    //       ResultCode: 0,
    //       ResultDesc: "...",
    //       CallbackMetadata: {
    //         Item: [
    //           { Name: "Amount", Value: 1 },
    //           { Name: "MpesaReceiptNumber", Value: "..." },
    //           { Name: "TransactionDate", Value: 20261016123456 },
    //           { Name: "PhoneNumber", Value: 254712345678 }
    //         ]
    //       }
    //     }
    //   }
    // }

    const stkCallback = body?.Body?.stkCallback as StkCallback | undefined;
    if (!stkCallback) {
      console.error(`[${requestId}] Callback missing stkCallback`);
      return accepted();
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    if (!CheckoutRequestID) {
      console.error(`[${requestId}] Missing CheckoutRequestID`);
      return accepted();
    }

    const isSuccessful = Number(ResultCode) === 0;

    // ResultCode 0 means the customer completed payment successfully. ResultCode 1032
    // means the customer cancelled the STK prompt; all other non-zero values are failures.
    let mpesaReceipt: string | null = null;
    let senderPhone: string | null = null;
    let paidAmount: number | null = null;

    if (isSuccessful && CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") {
          mpesaReceipt = String(item.Value);
        }
        if (item.Name === "PhoneNumber") {
          senderPhone = String(item.Value);
        }
        if (item.Name === "Amount") {
          paidAmount = Number(item.Value);
        }
      }
    }

    console.log(`[${requestId}] CheckoutRequestID=${CheckoutRequestID}, ResultCode=${ResultCode}, Desc="${ResultDesc}"`);

    await connectDB();

    // Idempotency guard: if the order is already in a terminal state, skip
    const existing = await Order.findOne({
      checkoutRequestId: CheckoutRequestID,
    })
      .select("paymentStatus amount total phone")
      .lean();

    if (!existing) {
      console.error(
        `[${requestId}] Order not found for CheckoutRequestID: ${CheckoutRequestID}`
      );
      // Return 200 so Daraja stops retrying
      return accepted();
    }

    if (existing.paymentStatus === "paid") {
      console.log(`[${requestId}] Order already paid; duplicate callback ignored`);
      return accepted();
    }

    const expectedAmount = existing.amount ?? existing.total;
    if (isSuccessful && (paidAmount !== expectedAmount || senderPhone !== normalizePhone(existing.phone))) {
      console.error(
        `[${requestId}] Callback amount or phone mismatch for ${CheckoutRequestID}`
      );
      return accepted();
    }

    if (isSuccessful && !mpesaReceipt) {
      console.error(`[${requestId}] Successful callback missing M-Pesa receipt`);
      return accepted();
    }

    // The callback is the source of truth. A pending-state filter prevents duplicate or
    // out-of-order callbacks from replacing a terminal payment result.
    const updated = await Order.findOneAndUpdate(
      { checkoutRequestId: CheckoutRequestID, paymentStatus: "pending" },
      {
        $set: {
          paymentStatus: isSuccessful ? "paid" : "failed",
          mpesaReceipt,
          senderPhone,
          paymentDate: isSuccessful ? new Date() : null,
          ...(isSuccessful && { status: "Processed" }),
        },
      },
      { new: true }
    );

    if (!updated) {
      console.error(
        `[${requestId}] Order update returned null for ${CheckoutRequestID}`
      );
      return accepted();
    }

    console.log(
      `[${requestId}] Order ${updated._id} updated — ` +
        `paymentStatus=${updated.paymentStatus}, ` +
        `mpesaReceipt=${updated.mpesaReceipt}`
    );

    return accepted();
  } catch (error) {
    console.error(`[${requestId}] Callback processing error:`, error);
    return accepted();
  }
}