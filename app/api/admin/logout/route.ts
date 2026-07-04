import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Admin logged out successfully." }, { status: 200 });
  
  // Force expire the admin token cookie
  response.cookies.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}