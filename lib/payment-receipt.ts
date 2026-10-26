import { randomBytes } from "node:crypto";

/** Create a human-readable receipt ID for a successfully confirmed payment. */
export function generatePaymentReceipt(orderId: string, paidAt = new Date()): string {
  const date = paidAt.toISOString().slice(0, 10).replace(/-/g, "");
  const orderSuffix = orderId.slice(-6).toUpperCase();
  const uniqueSuffix = randomBytes(3).toString("hex").toUpperCase();
  return `AG-${date}-${orderSuffix}-${uniqueSuffix}`;
}
