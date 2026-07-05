import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { jwtVerify } from "jose";
import mongoose from "mongoose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret"
);

/**
 * Helper to extract and verify session tokens
 */
async function getAuthPayload(request: NextRequest, tokenName: "token" | "admin_token") {
  const token = request.cookies.get(tokenName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// GET: Personalized History / Admin View
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const adminSession = await getAuthPayload(request, "admin_token");
    const customerSession = await getAuthPayload(request, "token");

    // 1. Admin Access: Full visibility
    if (adminSession?.role === "admin") {
      const allRecords = await Order.find({}).sort({ createdAt: -1 });
      return NextResponse.json(allRecords, { status: 200 });
    }

    // 2. Customer Access: Strict Isolation
    if (customerSession) {
      const rawId = customerSession.id || customerSession._id || customerSession.sub;
      if (!rawId) return NextResponse.json({ message: "Invalid session." }, { status: 401 });

      // Clean, direct query: No redundant operators, no duplicate keys.
      // This forces the DB to find orders ONLY where the user matches the session ID.
      const customerId = new mongoose.Types.ObjectId(rawId.toString());
      const records = await Order.find({ user: customerId }).sort({ createdAt: -1 });
      
      return NextResponse.json(records, { status: 200 });
    }

    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// POST: Create Order
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getAuthPayload(request, "token");
    const { name, email, phone, paymentMethod, cart, total } = await request.json();

    // Logic: If a session exists, use it. If not, it remains null (Guest Order).
    let userId = null;
    if (session) {
      const rawId = session.id || session._id || session.sub;
      if (rawId && mongoose.Types.ObjectId.isValid(rawId.toString())) {
        userId = new mongoose.Types.ObjectId(rawId.toString());
      }
    }

    const newOrder = await Order.create({
      user: userId,
      customerName: name,
      customerEmail: email,
      phone,
      paymentMethod,
      itemsSummary: cart.map((i: any) => `${i.product.name} × ${i.quantity}`).join(", "),
      total,
      status: "Pending"
    });
    
    return NextResponse.json({ orderId: newOrder._id }, { status: 201 });
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ message: "Failed to create order." }, { status: 500 });
  }
}

// PUT / DELETE: Standardized Admin-Only handlers...
// (These remain the same as your previous code as they were already robust)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const admin = await getAuthPayload(request, "admin_token");
    if (!admin || admin.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    
    const { id, status } = await request.json();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    return order ? NextResponse.json(order) : NextResponse.json({ message: "Not found" }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const admin = await getAuthPayload(request, "admin_token");
    if (!admin || admin.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const id = new URL(request.url).searchParams.get("id");
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}