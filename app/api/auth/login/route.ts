// // app/api/login/route.ts or app/api/auth/login/route.ts
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// export async function POST(request: Request) {
//   try {
//     await connectDB();
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
//     }

//     // 1. Generate a secure JWT containing full user identity context
//     // CHANGED: Added fullName explicitly so edge runtimes and frontend components can read it instantly
//     const token = jwt.sign(
//       { 
//         id: user._id, 
//         fullName: user.fullName, 
//         email: user.email, 
//         role: user.role 
//       },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     const targetDashboard = user.role === "admin" ? "/admin/dashboard" : "/dashboard";

//     const response = NextResponse.json(
//       {
//         message: "Login successful.",
//         redirectTo: targetDashboard,
//         user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
//       },
//       { status: 200 }
//     );

//     response.cookies.set({
//       name: "token",
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 60 * 60 * 24 * 7,
//       path: "/",
//     });

//     return response;
//   } catch (error: any) {
//     console.error("Login route error:", error);
//     return NextResponse.json({ message: "Internal server error occurred." }, { status: 500 });
//   }
// }



// app/api/auth/login/route.ts
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

    // Generate JWT with user ID as a STRING
    const token = jwt.sign(
      { 
        id: user._id.toString(), // ← CRITICAL: Convert to string
        fullName: user.fullName, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const targetDashboard = user.role === "admin" ? "/admin/dashboard" : "/dashboard";

    const response = NextResponse.json(
      {
        message: "Login successful.",
        redirectTo: targetDashboard,
        user: { 
          id: user._id.toString(), 
          fullName: user.fullName, 
          email: user.email, 
          role: user.role 
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json({ message: "Internal server error occurred." }, { status: 500 });
  }
}