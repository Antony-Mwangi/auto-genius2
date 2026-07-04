import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // 1. Find the user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
    }

    // 2. Strict Role Verification (Stop customers here)
    if (user.role !== "admin") {
      return NextResponse.json({ message: "Access denied. Not an authorized admin account." }, { status: 403 });
    }

    // 3. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
    }

    // 4. Generate Admin JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" } // Admin session lasts 24 hours
    );

    const response = NextResponse.json(
      {
        message: "Admin login successful.",
        user: { id: user._id, fullName: user.fullName, email: user.email, role: "admin" },
      },
      { status: 200 }
    );

    // 5. Store session securely in an HTTP-only cookie
    response.cookies.set({
      name: "admin_token", 
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Admin login API error:", error);
    return NextResponse.json({ message: "Internal server error occurred." }, { status: 500 });
  }
}