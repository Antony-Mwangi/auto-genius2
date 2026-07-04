import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Admin console session closed successfully." }, 
      { status: 200 }
    );

    // Erase cookie storage instantly by forcing maxAge execution to 0 seconds
    response.cookies.set({
      name: "admin_token",
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
      { message: "Failed to cleanly drop session state." }, 
      { status: 500 }
    );
  }
}