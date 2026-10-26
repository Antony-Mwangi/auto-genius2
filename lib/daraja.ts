// lib/daraja.ts

/**
 * Normalize Kenyan phone numbers to the 254XXXXXXXXX format required by Daraja.
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "").replace(/^\+/, "");
  if (cleaned.startsWith("0")) return "254" + cleaned.slice(1);
  if (cleaned.startsWith("254")) return cleaned;
  return "254" + cleaned;
}

/**
 * Generate the Daraja password: base64(Shortcode + Passkey + Timestamp)
 * The timestamp must be in East Africa Time (EAT), format YYYYMMDDHHmmss.
 */
export function generatePassword(
  shortcode: string,
  passkey: string,
  timestamp: string
): string {
  const raw = `${shortcode}${passkey}${timestamp}`;
  return Buffer.from(raw).toString("base64");
}

/**
 * Generate a timestamp in the format YYYYMMDDHHmmss (East Africa Time).
 */
export function generateTimestamp(): string {
  const now = new Date();
  // Convert to East Africa Time (UTC+3)
  const eat = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  return eat
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);
}

function getDarajaBaseUrl(): string {
  const env = process.env.MPESA_ENV || process.env.MPESA_ENVIRONMENT || "sandbox";
  if (env !== "sandbox" && env !== "production") {
    throw new Error("MPESA_ENV must be sandbox or production.");
  }
  const defaultBaseUrl = env === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
  const baseUrl = process.env.MPESA_BASE_URL || defaultBaseUrl;
  if (!["https://api.safaricom.co.ke", "https://sandbox.safaricom.co.ke"].includes(baseUrl)) {
    throw new Error("MPESA_BASE_URL must be an official Safaricom Daraja URL.");
  }
  return baseUrl;
}

function getMerchantCredentials() {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  if (!shortcode || !passkey) {
    throw new Error("MPESA_SHORTCODE and MPESA_PASSKEY must be configured.");
  }
  return { shortcode, passkey };
}

/**
 * Fetch an OAuth access token from Daraja.
 * Tokens are valid for ~1 hour.
 */
export async function getAccessToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  if (!consumerKey || !consumerSecret) {
    throw new Error("MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET must be configured.");
  }
  const baseUrl = getDarajaBaseUrl();

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  const response = await fetch(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Daraja auth failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  if (typeof data.access_token !== "string" || !data.access_token) {
    throw new Error("Daraja did not return an access token.");
  }
  return data.access_token;
}

/**
 * Initiate an STK Push to the customer's phone.
 * Returns the immediate response from Daraja (contains CheckoutRequestID).
 */
export async function initiateStkPush(
  phoneNumber: string,
  amount: number,
  orderId: string,
  callbackUrl: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const accessToken = await getAccessToken();
    const { shortcode, passkey } = getMerchantCredentials();
    const baseUrl = getDarajaBaseUrl();

    const timestamp = generateTimestamp();
    const password = generatePassword(shortcode, passkey, timestamp);
    const normalizedPhone = normalizePhone(phoneNumber);

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: orderId,
      TransactionDesc: `Payment for order ${orderId}`,
    };

    const response = await fetch(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok || data.ResponseCode !== "0") {
      return {
        success: false,
        error: data.errorMessage || data.ResponseDescription || "STK push failed",
        data,
      };
    }

    return { success: true, data };
  } catch (error: unknown) {
    console.error("[Daraja] STK push error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initiate payment",
    };
  }
}

