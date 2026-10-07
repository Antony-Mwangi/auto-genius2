// lib/kopokopo.ts

let k2Instance: any = null;

/**
 * Lazily initialize the K2 Connect SDK.
 * The SDK's default export is a callable factory function.
 */
function getK2() {
  if (k2Instance) return k2Instance;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const K2Factory = require("k2-connect-node");
  const factory = typeof K2Factory === "function" ? K2Factory : K2Factory.default;

  if (typeof factory !== "function") {
    throw new Error(
      "k2-connect-node: expected a callable factory function. Check the package's export shape."
    );
  }

  k2Instance = factory({
    baseUrl: process.env.KOPOKOPO_BASE_URL!,
    clientId: process.env.KOPOKOPO_CLIENT_ID!,
    clientSecret: process.env.KOPOKOPO_CLIENT_SECRET!,
    apiKey: process.env.KOPOKOPO_API_KEY!,
  });

  return k2Instance;
}

/**
 * Extract the location URL from the SDK response.
 * The Node SDK returns the URL as a plain string, but we handle
 * both string and object shapes for safety.
 */
function extractLocationUrl(response: any): string | null {
  if (typeof response === "string" && response.startsWith("http")) {
    return response;
  }

  if (response && typeof response === "object") {
    const possible = [
      response.location,
      response.location_url,
      response.data?.location,
      response.data?.location_url,
      response.data?.attributes?.location,
    ];
    for (const p of possible) {
      if (typeof p === "string" && p.startsWith("http")) return p;
    }
  }

  return null;
}

/**
 * Get an OAuth access token from Kopo Kopo.
 */
export async function getAccessToken(): Promise<string> {
  const k2 = getK2();
  const response = await k2.TokenService.getToken();

  const token = response?.access_token || response?.accessToken;
  if (!token) {
    throw new Error("No access token found in TokenService response.");
  }
  return token;
}

/**
 * Initiate an STK Push to the customer's phone.
 * Returns a `location` URL that can be polled for the final payment status.
 */
export async function initiateStkPush(
  phoneNumber: string,
  amount: number,
  orderId: string,
  callbackUrl: string
): Promise<{ success: boolean; location?: string; error?: string }> {
  try {
    const k2 = getK2();
    const accessToken = await getAccessToken();

    // Normalise phone: strip spaces, +, and leading 0 → 254XXXXXXXXX
    const formattedPhone = phoneNumber
      .replace(/\s+/g, "")
      .replace(/^\+/, "")
      .replace(/^0/, "254");

    // ⬇️ CORRECTED: The SDK expects `tillNumber` (camelCase), not `till_number`.
    // The value must be your actual Till number or Kopo Kopo Online Payment account number.
    const response = await k2.StkService.initiateIncomingPayment({
      tillNumber: process.env.KOPOKOPO_TILL_NUMBER!, // ✅ Correct parameter name
      firstName: "Customer",
      lastName: "",
      phoneNumber: formattedPhone,
      currency: "KES",
      amount: Math.round(amount),
      callbackUrl,
      paymentChannel: "M-PESA STK Push",
      accessToken,
      metadata: { orderId },
    });

    console.log("Kopo Kopo STK Push raw response:", response);

    const locationUrl = extractLocationUrl(response);
    if (!locationUrl) {
      throw new Error("No status URL found. Raw response: " + String(response));
    }

    return { success: true, location: locationUrl };
  } catch (error: any) {
    console.error("STK Push initiation failed:", error);
    return { success: false, error: error.message || "Failed to initiate payment" };
  }
}

/**
 * Query the payment status at the given location URL.
 */
export async function getStkStatus(locationUrl: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const k2 = getK2();
    const accessToken = await getAccessToken();

    const status = await k2.StkService.getStatus({
      location: locationUrl,
      accessToken,
    });

    return { success: true, data: status };
  } catch (error: any) {
    console.error("STK status query failed:", error);
    return { success: false, error: error.message || "Failed to query payment status" };
  }
}