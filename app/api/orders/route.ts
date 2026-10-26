// app/api/orders/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { createPaymentAccessToken, hashPaymentAccessToken } from "@/lib/order-payment-token";
import { jwtVerify, type JWTPayload } from "jose";
import mongoose from "mongoose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret"
);

// Allowed fulfillment status lifecycle
const ALLOWED_STATUSES = [
  "Pending",
  "Processed",
  "Dispatched",
  "Delivered",
] as const;
type OrderStatus = (typeof ALLOWED_STATUSES)[number];

const VALID_STATUS_FILTERS = [...ALLOWED_STATUSES, "All"] as const;

// ==================== Auth Helpers ====================

async function getAuthPayload(
  request: NextRequest,
  tokenName: "token" | "admin_token"
): Promise<JWTPayload | null> {
  const token = request.cookies.get(tokenName)?.value;

  if (!token) {
    console.log(`[auth] No ${tokenName} cookie found`);
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log(
      `[auth] Verified ${tokenName} for user:`,
      payload.id || payload.sub
    );
    return payload;
  } catch (error) {
    console.error(`[auth] JWT verification failed for ${tokenName}:`, error);
    return null;
  }
}

function extractUserId(session: JWTPayload | null): string | null {
  if (!session) return null;

  const possibleIdFields = ["id", "_id", "sub", "userId", "user_id", "uid"];

  for (const field of possibleIdFields) {
    const value = (session as Record<string, unknown>)[field];
    if (!value) continue;

    if (typeof value === "string" && mongoose.Types.ObjectId.isValid(value)) {
      return value;
    }

    if (typeof value === "object" && "toString" in value) {
      const strId = String(value);
      if (mongoose.Types.ObjectId.isValid(strId)) return strId;
    }
  }

  return null;
}

async function validateUser(userId: string): Promise<boolean> {
  try {
    const user = await User.findById(userId).select("_id").lean();
    return !!user;
  } catch {
    return false;
  }
}

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

// ==================== GET: Fetch Orders ====================
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (statusFilter) {
      if (!VALID_STATUS_FILTERS.includes(statusFilter as any)) {
        return NextResponse.json(
          {
            error: `Invalid status. Allowed values: ${VALID_STATUS_FILTERS.join(", ")}`,
          },
          { status: 400 }
        );
      }
      if (statusFilter !== "All") filter.status = statusFilter;
    }

    // ---- Admin path ----
    const adminSession = await getAuthPayload(request, "admin_token");
    if (adminSession?.role === "admin") {
      const [records, totalCount] = await Promise.all([
        Order.find(filter)
          .sort({ createdAt: -1 })
          .populate("user", "fullName email")
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments(filter),
      ]);

      console.log(`[${requestId}] Admin fetched ${records.length}/${totalCount}`);

      return NextResponse.json(records, {
        status: 200,
        headers: {
          "X-Total-Count": totalCount.toString(),
          "X-Filter-Status": statusFilter || "All",
        },
      });
    }

    // ---- Customer path ----
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

    const user = await User.findById(userId).select("email").lean();
    if (!user) {
      return NextResponse.json(
        {
          error: "User account not found. Please log out and log in again.",
          details: "User ID does not exist in database",
        },
        { status: 404 }
      );
    }

    const associatedCount = await associateOrdersWithUser(
      new mongoose.Types.ObjectId(userId),
      user.email
    );

    const customerId = new mongoose.Types.ObjectId(userId);
    const customerFilter: Record<string, unknown> = { user: customerId };
    if (statusFilter && statusFilter !== "All") {
      customerFilter.status = statusFilter;
    }

    const [records, totalCount] = await Promise.all([
      Order.find(customerFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(customerFilter),
    ]);

    console.log(
      `[${requestId}] Customer ${userId} fetched ${records.length}/${totalCount}` +
        (associatedCount > 0 ? ` (linked ${associatedCount} guest orders)` : "")
    );

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
    const { name, email, phone, paymentMethod, cart, shippingLocation } = body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof phone !== "string" || !phone.trim() ||
      !["M-Pesa", "Cash on Delivery"].includes(paymentMethod) ||
      !Array.isArray(cart) ||
      cart.length === 0 ||
      cart.length > 50 ||
      !["Nairobi Area", "Outside Nairobi", "Pickup at Shop"].includes(shippingLocation)
    ) {
      return NextResponse.json(
        {
          error: "Provide valid customer details, payment method, shipping location, and cart.",
        },
        { status: 400 }
      );
    }

    const cartLines: { productId: string; variantId?: string; quantity: number }[] = [];
    for (const item of cart) {
      const productId = item?.product?._id;
      const variantId = item?.selectedVariant?._id;
      if (
        typeof productId !== "string" ||
        !mongoose.Types.ObjectId.isValid(productId) ||
        (variantId !== undefined && (typeof variantId !== "string" || !mongoose.Types.ObjectId.isValid(variantId))) ||
        !Number.isSafeInteger(item?.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        return NextResponse.json({ error: "Cart contains an invalid product or quantity." }, { status: 400 });
      }
      cartLines.push({ productId, variantId, quantity: item.quantity });
    }

    const products = await Product.find({
      _id: { $in: cartLines.map((line) => line.productId) },
    }).lean();
    const productById = new Map(products.map((product) => [String(product._id), product]));
    let subtotal = 0;
    const itemsSummary: string[] = [];

    for (const line of cartLines) {
      const product = productById.get(line.productId);
      if (!product) {
        return NextResponse.json({ error: "A product in your cart is no longer available." }, { status: 400 });
      }

      const variants = (product.variants || []) as Array<{
        _id: mongoose.Types.ObjectId;
        name: string;
        price: number;
        isDefault?: boolean;
      }>;
      const variant = line.variantId
        ? variants.find((entry) => String(entry._id) === line.variantId)
        : variants.find((entry) => entry.isDefault) || variants[0];
      if (line.variantId && !variant) {
        return NextResponse.json({ error: `The selected option for ${product.name} is unavailable.` }, { status: 400 });
      }

      const unitPrice = Number(variant?.price ?? product.price);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return NextResponse.json({ error: `Price is unavailable for ${product.name}.` }, { status: 400 });
      }
      subtotal += unitPrice * line.quantity;
      itemsSummary.push(`${product.name}${variant ? ` (${variant.name})` : ""} × ${line.quantity}`);
    }

    const shippingCost = {
      "Nairobi Area": 300,
      "Outside Nairobi": 600,
      "Pickup at Shop": 0,
    }[shippingLocation as "Nairobi Area" | "Outside Nairobi" | "Pickup at Shop"];
    const total = Math.round(subtotal + shippingCost);
    if (!Number.isSafeInteger(total) || total < 1) {
      return NextResponse.json({ error: "Order total must be at least KES 1." }, { status: 400 });
    }

    const session = await getAuthPayload(request, "token");
    let userId: mongoose.Types.ObjectId | null = null;

    if (session) {
      const userIdStr = extractUserId(session);
      if (userIdStr && (await validateUser(userIdStr))) {
        userId = new mongoose.Types.ObjectId(userIdStr);
      }
    }

    const resolvedPaymentStatus = paymentMethod === "M-Pesa" ? "pending" : "unpaid";
    const paymentAccessToken = createPaymentAccessToken();

    const newOrder = await Order.create({
      user: userId,
      customerName: name.trim(),
      customerEmail: email.toLowerCase(),
      phone: phone.trim(),
      paymentMethod,
      itemsSummary: itemsSummary.join(", "),
      amount: total,
      total,
      status: "Pending",
      paymentStatus: resolvedPaymentStatus,
      paymentAccessTokenHash: hashPaymentAccessToken(paymentAccessToken),
    });

    const orderNumber = newOrder._id.toString().slice(-6).toUpperCase();

    console.log(
      `[${requestId}] Order created: ${newOrder._id} (#${orderNumber})`
    );

    return NextResponse.json(
      {
        message: "Order created successfully.",
        orderId: newOrder._id,
        orderNumber,
        associatedUser: !!userId,
        paymentAccessToken,
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

// ==================== PUT: Update Order Status (Admin) ====================
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
      return NextResponse.json(
        { error: "Order ID is required." },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status as OrderStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
        },
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

    console.log(`[${requestId}] Order ${id} → ${status}`);

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

// ==================== DELETE: Delete Order (Admin) ====================
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
      return NextResponse.json(
        { error: "Order ID is required." },
        { status: 400 }
      );
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

    console.log(`[${requestId}] Order deleted: ${id}`);

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

// ==================== OPTIONS: CORS ====================
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}