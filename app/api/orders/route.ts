import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// ==================== POST: SAVE CUSTOMER ORDER DETAILS ====================
export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, phone, paymentMethod, cart, total } = await request.json();

    if (!name || !phone || !cart || cart.length === 0) {
      return NextResponse.json({ message: "Validation parameters rejected." }, { status: 400 });
    }

    // Format an easily readable items summary text description line item block for the dashboard view
    const itemsSummary = cart.map((item: any) => `${item.product.name} × ${item.quantity}`).join(", ");

    const newOrder = await Order.create({
      customerName: name,
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

// ==================== GET: FETCH ORDER DOCUMENTS FOR ADMIN TERMINAL ====================
export async function GET() {
  try {
    await connectDB();
    const records = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to gather operational tickets." }, { status: 500 });
  }
}

// ==================== PUT: UPDATE ORDER DISPATCH STATUS ====================
export async function PUT(request: Request) {
  try {
    await connectDB();
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: "Missing required modification properties." }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Returns the modified document instead of the original
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