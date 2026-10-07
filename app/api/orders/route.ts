// app/api/orders/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { jwtVerify } from "jose";
import mongoose from "mongoose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret"
);

// Allowed status lifecycle
const ALLOWED_STATUSES = ["Pending", "Processed", "Dispatched", "Delivered"] as const;
type OrderStatus = typeof ALLOWED_STATUSES[number];

/**
 * Extract and verify session tokens with enhanced error handling
 */
async function getAuthPayload(request: NextRequest, tokenName: "token" | "admin_token") {
  const token = request.cookies.get(tokenName)?.value;

  if (!token) {
    console.log(`No ${tokenName} cookie found`);
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log(`Successfully verified ${tokenName} for user:`, payload.id || payload.sub);
    return payload;
  } catch (error) {
    console.error(`JWT verification failed for ${tokenName}:`, error);
    return null;
  }
}

/**
 * Safely extract user ID from session payload with multiple fallbacks
 */
function extractUserId(session: any): string | null {
  if (!session) return null;

  const possibleIdFields = ["id", "_id", "sub", "userId", "user_id", "uid"];
  for (const field of possibleIdFields) {
    const value = session[field];
    if (value) {
      if (typeof value === "string") {
        if (mongoose.Types.ObjectId.isValid(value)) return value;
      } else if (value && typeof value.toString === "function") {
        const strId = value.toString();
        if (mongoose.Types.ObjectId.isValid(strId)) return strId;
      }
    }
  }
  return null;
}

/**
 * Validate that a user exists in the database
 */
async function validateUser(userId: string): Promise<boolean> {
  try {
    const user = await User.findById(userId);
    return !!user;
  } catch {
    return false;
  }
}

/**
 * Associate orders with a user by their email
 */
async function associateOrdersWithUser(
  userId: mongoose.Types.ObjectId,
  email: string
): Promise<number> {
  try {
    const result = await Order.updateMany(
      { customerEmail: email.toLowerCase(), user: null },
      { user: userId }
    );
    return result.modifiedCount;
  } catch {
    return 0;
  }
}

// ==================== GET: Fetch Orders with Status Filtering ====================
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (statusFilter) {
      const validStatuses = ["Pending", "Processed", "Dispatched", "Delivered", "All"];
      if (validStatuses.includes(statusFilter)) {
        if (statusFilter !== "All") filter.status = statusFilter;
      } else {
        return NextResponse.json(
          { error: `Invalid status. Allowed values: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Admin session
    const adminSession = await getAuthPayload(request, "admin_token");
    if (adminSession?.role === "admin") {
      const allRecords = await Order.find(filter)
        .sort({ createdAt: -1 })
        .populate("user", "fullName email")
        .skip(skip)
        .limit(limit);

      const totalCount = await Order.countDocuments(filter);

      return NextResponse.json(allRecords, {
        status: 200,
        headers: {
          "X-Total-Count": totalCount.toString(),
          "X-Filter-Status": statusFilter || "All",
        },
      });
    }

    // Customer session
    const customerSession = await getAuthPayload(request, "token");
    if (!customerSession) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to view your orders." },
        { status: 401 }
      );
    }

    const userId = extractUserId(customerSession);
    if (!userId) {
      return NextResponse.json(
        {
          error: "Invalid session data. Please log out and log in again.",
          details: "User ID not found in session",
        },
        { status: 401 }
      );
    }

    const userExists = await validateUser(userId);
    if (!userExists) {
      return NextResponse.json(
        {
          error: "User account not found. Please log out and log in again.",
          details: "User ID does not exist in database",
        },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const associatedCount = await associateOrdersWithUser(
      new mongoose.Types.ObjectId(userId),
      user.email
    );

    const customerId = new mongoose.Types.ObjectId(userId);
    const customerFilter: any = { user: customerId };
    if (statusFilter && statusFilter !== "All") customerFilter.status = statusFilter;

    const records = await Order.find(customerFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Order.countDocuments(customerFilter);

    return NextResponse.json(records, {
      status: 200,
      headers: {
        "X-Total-Count": totalCount.toString(),
        "X-User-ID": userId,
        "X-Fixed-Orders": associatedCount.toString(),
        "X-Filter-Status": statusFilter || "All",
      },
    });
  } catch (error) {
    console.error(`[${requestId}] GET Orders Error:`, error);
    return NextResponse.json(
      {
        error: "Server error while fetching your orders.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ==================== POST: Create Order ====================
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    await connectDB();

    const body = await request.json();
    // ⬇️ Now also captures paymentStatus sent by the checkout page
    const { name, email, phone, paymentMethod, cart, total, paymentStatus } = body;

    if (!name || !email || !phone || !cart || !total) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. Please provide name, email, phone, cart, and total.",
        },
        { status: 400 }
      );
    }

    const session = await getAuthPayload(request, "token");
    let userId = null;

    if (session) {
      const userIdStr = extractUserId(session);
      if (userIdStr && mongoose.Types.ObjectId.isValid(userIdStr)) {
        const userExists = await validateUser(userIdStr);
        if (userExists) {
          userId = new mongoose.Types.ObjectId(userIdStr);
        }
      }
    }

    // M-Pesa orders default to "pending" until confirmed; COD stays "unpaid"
    const resolvedPaymentStatus =
      paymentStatus ||
      (paymentMethod === "M-Pesa" ? "pending" : "unpaid");

    const newOrder = await Order.create({
      user: userId,
      customerName: name,
      customerEmail: email.toLowerCase(),
      phone,
      paymentMethod,
      itemsSummary: cart
        .map((i: any) => `${i.product.name} × ${i.quantity}`)
        .join(", "),
      total,
      status: "Pending",
      paymentStatus: resolvedPaymentStatus,
    });

    const orderIdStr = newOrder._id.toString();
    const orderNumber = orderIdStr.slice(-6).toUpperCase();

    return NextResponse.json(
      {
        message: "Order created successfully.",
        orderId: newOrder._id,
        orderNumber,
        associatedUser: !!userId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`[${requestId}] POST Order Error:`, error);
    return NextResponse.json(
      {
        error: "Failed to create your order. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update Order Status (Admin Only) ====================
export async function PUT(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    await connectDB();

    const admin = await getAuthPayload(request, "admin_token");
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { id, status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: "Status is required." }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: `Order with ID ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Order status updated successfully.", order },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[${requestId}] PUT Order Error:`, error);
    return NextResponse.json(
      {
        error: "Failed to update order status.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete Order (Admin Only) ====================
export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    await connectDB();

    const admin = await getAuthPayload(request, "admin_token");
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid order ID format." },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { error: `Order with ID ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Order deleted successfully.", deletedOrderId: id },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[${requestId}] DELETE Order Error:`, error);
    return NextResponse.json(
      {
        error: "Failed to delete order.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ==================== OPTIONS: CORS Support ====================
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}