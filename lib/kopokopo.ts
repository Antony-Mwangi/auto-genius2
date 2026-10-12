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
  const factory =
    typeof K2Factory === "function" ? K2Factory : K2Factory.default;

  if (typeof factory !== "function") {
    throw new Error(
      "k2-connect-node: expected a callable factory function. " +
        "Got: " + typeof K2Factory
    );
  }

  const baseUrl = process.env.KOPOKOPO_BASE_URL;
  const clientId = process.env.KOPOKOPO_CLIENT_ID;
  const clientSecret = process.env.KOPOKOPO_CLIENT_SECRET;
  const apiKey = process.env.KOPOKOPO_API_KEY;

  // Fail loudly if any env var is missing at runtime
  const missing = [
    !baseUrl && "KOPOKOPO_BASE_URL",
    !clientId && "KOPOKOPO_CLIENT_ID",
    !clientSecret && "KOPOKOPO_CLIENT_SECRET",
    !apiKey && "KOPOKOPO_API_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      "Missing Kopo Kopo environment variables: " + missing.join(", ")
    );
  }

  k2Instance = factory({
    baseUrl,
    clientId,
    clientSecret,
    apiKey,
  });

  console.log(
    "[KopoKopo] SDK initialized. baseUrl=" + baseUrl,
    "availableKeys=" + JSON.stringify(Object.keys(k2Instance))
  );

  return k2Instance;
}

/**
 * Get an OAuth access token from Kopo Kopo.
 * The SDK caches tokens internally for ~1 hour; a fresh token is only
 * requested when the previous one expires or after process restart.
 */
export async function getAccessToken(): Promise<string> {
  const k2 = getK2();

  const TokenService = k2.TokenService;
  if (!TokenService || typeof TokenService.getToken !== "function") {
    throw new Error(
      "K2 SDK: TokenService.getToken is not available. " +
        "Available keys: " + JSON.stringify(Object.keys(k2))
    );
  }

  const response = await TokenService.getToken();
  const token = response?.access_token || response?.accessToken;

  if (!token) {
    throw new Error(
      "No access token found. Response keys: " +
        JSON.stringify(Object.keys(response || {}))
    );
  }

  console.log(
    "[KopoKopo] Access token acquired: " +
      token.substring(0, 12) + "... (expires_in=" + response.expires_in + "s)"
  );

  return token;
}

/**
 * Extract the location URL from the SDK response.
 * The K2 SDK returns the status URL either as a plain string or
 * nested in an object — handle both.
 */
function extractLocationUrl(response: any): string | null {
  if (typeof response === "string" && response.startsWith("http")) {
    return response;
  }

  if (response && typeof response === "object") {
    const candidates = [
      response.location,
      response.location_url,
      response.data?.location,
      response.data?.location_url,
      response.data?.attributes?.location,
      response.data?.attributes?.location_url,
    ];
    for (const c of candidates) {
      if (typeof c === "string" && c.startsWith("http")) return c;
    }
  }

  return null;
}

/**
 * Initiate an STK Push to the customer's phone.
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

    // Normalise phone: strip spaces and +, replace leading 0 with 254
    const formattedPhone = phoneNumber
      .replace(/\s+/g, "")
      .replace(/^\+/, "")
      .replace(/^0/, "254");

    const tillNumber = process.env.KOPOKOPO_TILL_NUMBER;
    if (!tillNumber) {
      throw new Error("Missing KOPOKOPO_TILL_NUMBER env var");
    }

    const StkService = k2.StkService;
    if (
      !StkService ||
      typeof StkService.initiateIncomingPayment !== "function"
    ) {
      throw new Error(
        "K2 SDK: StkService.initiateIncomingPayment is not available. " +
          "Available keys: " + JSON.stringify(Object.keys(k2))
      );
    }

    const stkOptions = {
      tillNumber,
      firstName: "Customer",
      lastName: "",
      phoneNumber: formattedPhone,
      currency: "KES",
      amount: Math.round(amount),
      callbackUrl,
      paymentChannel: "M-PESA STK Push",
      accessToken,
      metadata: { orderId },
    };

    console.log("[KopoKopo] STK push request:", {
      tillNumber,
      phoneNumber: formattedPhone,
      amount: Math.round(amount),
      callbackUrl,
      orderId,
    });

    const response = await StkService.initiateIncomingPayment(stkOptions);

    console.log(
      "[KopoKopo] STK push raw response:",
      typeof response === "string" ? response : JSON.stringify(response)
    );

    const locationUrl = extractLocationUrl(response);

    if (!locationUrl) {
      throw new Error(
        "No status URL found in response. Got: " +
          (typeof response === "string" ? response : JSON.stringify(response))
      );
    }

    return { success: true, location: locationUrl };
  } catch (error: any) {
    // Kopo Kopo SDK throws errors with various shapes — normalise them
    const message =
      error?.message ||
      error?.error_message ||
      error?.error ||
      JSON.stringify(error) ||
      "Failed to initiate payment";

    console.error("[KopoKopo] STK Push initiation failed:", {
      message,
      code: error?.error_code || error?.code,
      raw: error,
    });

    return { success: false, error: String(message) };
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

    const StkService = k2.StkService;
    if (!StkService || typeof StkService.getStatus !== "function") {
      throw new Error(
        "K2 SDK: StkService.getStatus is not available. " +
          "Available keys: " + JSON.stringify(Object.keys(k2))
      );
    }

    const status = await StkService.getStatus({
      location: locationUrl,
      accessToken,
    });

    return { success: true, data: status };
  } catch (error: any) {
    const message =
      error?.message ||
      error?.error_message ||
      error?.error ||
      JSON.stringify(error) ||
      "Failed to query payment status";

    console.error("[KopoKopo] STK status query failed:", {
      message,
      code: error?.error_code || error?.code,
    });

    return { success: false, error: String(message) };
  }
}