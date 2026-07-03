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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // 1. Generate a secure JWT containing the user identity
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // 2. Build the response payload
    const response = NextResponse.json(
      {
        message: "Login successful.",
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      },
      { status: 200 }
    );

    // 3. Set the JWT inside an HTTP-only cookie for robust security
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true, // Prevents client-side scripts from reading the token
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json({ message: "Internal server error occurred." }, { status: 500 });
  }
}