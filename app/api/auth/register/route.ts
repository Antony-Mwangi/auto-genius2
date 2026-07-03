import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // Adjust the import path based on where you saved your db utility
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Keep your User Schema/Model defined here or imported from a models folder
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export async function POST(request: Request) {
  try {
    // Call your newly rewritten utility here 🚀
    await connectDB();
    
    const { fullName, email, phone, password } = await request.json();

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully.", userId: newUser._id }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}