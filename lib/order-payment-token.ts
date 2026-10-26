import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createPaymentAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashPaymentAccessToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function paymentAccessTokenMatches(token: unknown, storedHash: unknown): boolean {
  if (typeof token !== "string" || typeof storedHash !== "string") return false;
  const suppliedHash = Buffer.from(hashPaymentAccessToken(token), "hex");
  const expectedHash = Buffer.from(storedHash, "hex");
  return suppliedHash.length === expectedHash.length && timingSafeEqual(suppliedHash, expectedHash);
}
