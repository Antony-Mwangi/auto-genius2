// app/api/mpesa/query-status/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getStkStatus } from "@/lib/kopokopo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    const body = await request.json();
    const { location } = body;

    // ---- Validate the location URL ----
    if (!location || typeof location !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid location URL" },
        { status: 400 }
      );
    }

    if (!location.startsWith("http")) {
      return NextResponse.json(
        { error: "Location must be a valid HTTP(S) URL" },
        { status: 400 }
      );
    }

    const result = await getStkStatus(location);

    if (!result.success) {
      console.error(
        `[${requestId}] STK status query failed:`,
        result.error
      );
      return NextResponse.json(
        { error: result.error || "Failed to query status" },
        { status: 500 }
      );
    }

    // Log the full status payload for debugging
    console.log(
      `[${requestId}] STK status response:`,
      JSON.stringify(result.data)
    );

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error(`[${requestId}] Status query API error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}