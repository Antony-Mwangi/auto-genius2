
import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret"
);

// Helper function to extract and verify tokens within API routes securely
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

// ==================== POST: SAVE CUSTOMER / GUEST ORDER ====================
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const customerSession = await getAuthPayload(request, "token");
    const userId = customerSession ? (customerSession.id || customerSession._id) : null;

    // ADDED: Accept email directly from the request payload
    const { name, email, phone, paymentMethod, cart, total } = await request.json();

    // Enforce email check alongside other validation requirements
    if (!name || !email || !phone || !cart || cart.length === 0) {
      return NextResponse.json({ message: "Validation parameters rejected. Missing fields." }, { status: 400 });
    }

    const itemsSummary = cart.map((item: any) => `${item.product.name} × ${item.quantity}`).join(", ");

    const newOrder = await Order.create({
      user: userId, // Will be stored as null if checked out as guest
      customerName: name,
      customerEmail: email, // Saved securely for receipts and tracking
      phone,
      paymentMethod,
      itemsSummary,
      total,
      status: "Pending"
    });

    return NextResponse.json({ message: "Order processed.", order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Failed processing order ticket record entry." }, { status: 500 });
  }
}

// ==================== GET: PERSONALIZED HISTORY / ADMIN VIEW ====================
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const adminSession = await getAuthPayload(request, "admin_token");
    const customerSession = await getAuthPayload(request, "token");

    // 1. Admin Authorization Access Window
    if (adminSession && adminSession.role === "admin") {
      const allRecords = await Order.find({}).sort({ createdAt: -1 });
      return NextResponse.json(allRecords, { status: 200 });
    }

    // 2. Personalized Customer View Isolation
    if (customerSession) {
      const customerId = customerSession.id || customerSession._id;
      
      if (!customerId) {
        return NextResponse.json({ message: "Malformed session payload context." }, { status: 400 });
      }

      const userSpecificRecords = await Order.find({ user: customerId }).sort({ createdAt: -1 });
      return NextResponse.json(userSpecificRecords, { status: 200 });
    }

    // 3. Fallback tracking allowance for Guest confirmation states
    // If a guest provides a direct checkout order id tracking query parameter, allow them to view it
    const { searchParams } = new URL(request.url);
    const targetOrderId = searchParams.get("orderId");
    
    if (targetOrderId) {
      const targetGuestOrder = await Order.findById(targetOrderId);
      if (targetGuestOrder) {
        return NextResponse.json(targetGuestOrder, { status: 200 });
      }
    }

    return NextResponse.json({ message: "Access unauthorized." }, { status: 401 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to gather operational tickets." }, { status: 500 });
  }
}

// ==================== PUT: UPDATE ORDER DISPATCH STATUS ====================
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const adminSession = await getAuthPayload(request, "admin_token");
    if (!adminSession || adminSession.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized administration access." }, { status: 403 });
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: "Missing required modification properties." }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Target order ticket not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Order status modified successfully.", order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("Error modifying order status:", error);
    return NextResponse.json({ message: "Failed to alter status code entry." }, { status: 500 });
  }
}