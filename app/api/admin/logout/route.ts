import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

  // Clear all possible auth cookies
  const cookiesToClear = ["admin_token", "token", "session", "auth_token"];
  
  cookiesToClear.forEach(cookieName => {
    response.cookies.delete(cookieName);
  });

  return response;
}