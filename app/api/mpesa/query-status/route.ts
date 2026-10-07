import { NextResponse, type NextRequest } from "next/server";
import { getStkStatus } from "@/lib/kopokopo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    const body = await request.json();
    const { location } = body;

    if (!location) {
      return NextResponse.json(
        { error: "Missing location URL" },
        { status: 400 }
      );
    }

    const result = await getStkStatus(location);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to query status" },
        { status: 500 }
      );
    }

    // Log the raw status payload so we can trace it in dev
    console.log(`[${requestId}] STK status response:`, JSON.stringify(result.data));

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error(`[${requestId}] Status query API error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}