import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { normalizePhone } from "@/lib/daraja";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface KopoKopoResource {
  id?: string;
  amount?: string | number;
  currency?: string;
  reference?: string;
  sender_phone_number?: string;
  status?: string;
}

interface IncomingPaymentCallback {
  data?: {
    id?: string;
    type?: string;
    attributes?: {
      status?: string;
      metadata?: Record<string, string | number | undefined>;
      event?: {
        resource?: KopoKopoResource | null;
        errors?: string[] | null;
      };
    };
  };
}

function isAuthenticKopoKopoCallback(
  rawBody: string,
  parsedBody: IncomingPaymentCallback,
  signature: string | null
): boolean {
  const clientSecret = process.env.KOPOKOPO_CLIENT_SECRET;
  const apiKey = process.env.KOPOKOPO_API_KEY;
  if (!signature) return false;

  const supplied = signature.replace(/^sha256=/i, "").trim().toLowerCase();
  const suppliedBytes = Buffer.from(supplied, "hex");
  if (suppliedBytes.length !== 32) return false;

  // Kopo Kopo's webhook guide describes signing with client_secret; the
  // installed K2 Node SDK signs with api_key. Accept either documented SDK key.
  const payloads = [rawBody, JSON.stringify(parsedBody)];
  return [clientSecret, apiKey].some((key) => {
    if (!key) return false;
    return payloads.some((payload) => {
      const expectedBytes = createHmac("sha256", key).update(payload, "utf8").digest();
      return timingSafeEqual(suppliedBytes, expectedBytes);
    });
  });
}

function callbackAccepted() {
  return NextResponse.json({ received: true }, { status: 200 });
}

/**
 * Kopo Kopo posts the asynchronous incoming-payment result here. Its immediate
 * STK API response only means the request was accepted. `attributes.status`
 * becomes `Success` or `Failed` after processing; only `Success`, with a valid
 * amount and receipt, confirms an order as paid.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  let callback: IncomingPaymentCallback;
  try {
    callback = JSON.parse(rawBody) as IncomingPaymentCallback;
  } catch {
    return NextResponse.json({ error: "Invalid callback JSON." }, { status: 400 });
  }
  if (!isAuthenticKopoKopoCallback(rawBody, callback, request.headers.get("x-kopokopo-signature"))) {
    console.warn("Rejected Kopo Kopo callback with invalid signature.");
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const data = callback.data;
  const attributes = data?.attributes;
  const paymentRequestId = data?.id;
  const orderId = attributes?.metadata?.orderId;
  const result = attributes?.status?.toLowerCase();

  if (data?.type !== "incoming_payment" || !paymentRequestId || typeof orderId !== "string") {
    console.warn("Ignored Kopo Kopo callback missing payment/order reference.");
    return callbackAccepted();
  }

  if (result !== "success" && result !== "failed") {
    // An intermediate status is acknowledged but must not change payment state.
    return callbackAccepted();
  }

  try {
    await connectDB();
    const order = await Order.findOne({
      _id: orderId,
      paymentMethod: "M-Pesa",
      kopokopoPaymentId: paymentRequestId,
    }).select("paymentStatus amount total phone");

    if (!order) {
      console.warn("Kopo Kopo callback did not match an order.");
      return callbackAccepted();
    }

    if (order.paymentStatus === "paid" || order.paymentStatus !== "pending") {
      return callbackAccepted();
    }

    const resource = attributes?.event?.resource;
    const paidAmount = Number(resource?.amount);
    const receipt = resource?.reference;
    const senderPhone = resource?.sender_phone_number;

    if (result === "success") {
      const expectedAmount = Number(order.amount ?? order.total);
      if (
        !Number.isFinite(paidAmount) ||
        paidAmount !== expectedAmount ||
        !receipt ||
        (resource?.currency && resource.currency !== "KES") ||
        (resource?.status && resource.status.toLowerCase() !== "received")
      ) {
        console.error(`Kopo Kopo payment callback failed order verification for ${orderId}.`);
        return callbackAccepted();
      }
      if (senderPhone && normalizePhone(senderPhone) !== normalizePhone(order.phone)) {
        console.error(`Kopo Kopo payment callback phone did not match order ${orderId}.`);
        return callbackAccepted();
      }
    }

    await Order.findOneAndUpdate(
      { _id: orderId, paymentStatus: "pending", kopokopoPaymentId: paymentRequestId },
      {
        $set: {
          paymentStatus: result === "success" ? "paid" : "failed",
          mpesaReceipt: result === "success" ? receipt : null,
          senderPhone: result === "success" ? senderPhone || null : null,
          paymentDate: result === "success" ? new Date() : null,
          ...(result === "success" && { status: "Processed" }),
        },
      },
      { new: true }
    );

    return callbackAccepted();
  } catch (error) {
    console.error("Kopo Kopo callback processing failed:", error);
    // Non-2xx makes Kopo Kopo eligible to retry delivery.
    return NextResponse.json({ error: "Callback processing failed." }, { status: 500 });
  }
}
