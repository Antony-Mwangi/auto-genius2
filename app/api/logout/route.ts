import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Customer platform session closed successfully." }, 
      { status: 200 }
    );

    // Wipe customer cookie session token instantly by setting maxAge to zero
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, 
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to cleanly drop customer session state." }, 
      { status: 500 }
    );
  }
}