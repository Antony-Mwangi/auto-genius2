// import { NextResponse, type NextRequest } from "next/server";
// import { connectDB } from "@/lib/db";
// import Order from "@/models/Order";
// import { jwtVerify } from "jose";
// import mongoose from "mongoose";

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET || "fallback_secret"
// );

// /**
//  * Helper to extract and verify session tokens
//  */
// async function getAuthPayload(request: NextRequest, tokenName: "token" | "admin_token") {
//   const token = request.cookies.get(tokenName)?.value;
//   if (!token) return null;
//   try {
//     const { payload } = await jwtVerify(token, JWT_SECRET);
//     return payload;
//   } catch {
//     return null;
//   }
// }

// // GET: Personalized History / Admin View
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
//     const adminSession = await getAuthPayload(request, "admin_token");
//     const customerSession = await getAuthPayload(request, "token");

//     // 1. Admin Access: Full visibility
//     if (adminSession?.role === "admin") {
//       const allRecords = await Order.find({}).sort({ createdAt: -1 });
//       return NextResponse.json(allRecords, { status: 200 });
//     }

//     // 2. Customer Access: Strict Isolation
//     if (customerSession) {
//       const rawId = customerSession.id || customerSession._id || customerSession.sub;
//       if (!rawId) return NextResponse.json({ message: "Invalid session." }, { status: 401 });

//       // Clean, direct query: No redundant operators, no duplicate keys.
//       // This forces the DB to find orders ONLY where the user matches the session ID.
//       const customerId = new mongoose.Types.ObjectId(rawId.toString());
//       const records = await Order.find({ user: customerId }).sort({ createdAt: -1 });
      
//       return NextResponse.json(records, { status: 200 });
//     }

//     return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
//   } catch (error) {
//     console.error("GET Orders Error:", error);
//     return NextResponse.json({ message: "Server error." }, { status: 500 });
//   }
// }

// // POST: Create Order
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const session = await getAuthPayload(request, "token");
//     const { name, email, phone, paymentMethod, cart, total } = await request.json();

//     // Logic: If a session exists, use it. If not, it remains null (Guest Order).
//     let userId = null;
//     if (session) {
//       const rawId = session.id || session._id || session.sub;
//       if (rawId && mongoose.Types.ObjectId.isValid(rawId.toString())) {
//         userId = new mongoose.Types.ObjectId(rawId.toString());
//       }
//     }

//     const newOrder = await Order.create({
//       user: userId,
//       customerName: name,
//       customerEmail: email,
//       phone,
//       paymentMethod,
//       itemsSummary: cart.map((i: any) => `${i.product.name} × ${i.quantity}`).join(", "),
//       total,
//       status: "Pending"
//     });
    
//     return NextResponse.json({ orderId: newOrder._id }, { status: 201 });
//   } catch (error) {
//     console.error("POST Order Error:", error);
//     return NextResponse.json({ message: "Failed to create order." }, { status: 500 });
//   }
// }

// // PUT / DELETE: Standardized Admin-Only handlers...
// // (These remain the same as your previous code as they were already robust)
// export async function PUT(request: NextRequest) {
//   try {
//     await connectDB();
//     const admin = await getAuthPayload(request, "admin_token");
//     if (!admin || admin.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    
//     const { id, status } = await request.json();
//     const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
//     return order ? NextResponse.json(order) : NextResponse.json({ message: "Not found" }, { status: 404 });
//   } catch (e) {
//     return NextResponse.json({ message: "Error" }, { status: 500 });
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     await connectDB();
//     const admin = await getAuthPayload(request, "admin_token");
//     if (!admin || admin.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

//     const id = new URL(request.url).searchParams.get("id");
//     await Order.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Deleted" });
//   } catch (e) {
//     return NextResponse.json({ message: "Error" }, { status: 500 });
//   }
// }




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
  if (!session) {
    console.log("Session is null or undefined");
    return null;
  }
  
  console.log("Extracting user ID from session:", JSON.stringify(session, null, 2));
  
  // Try different possible ID fields in order of preference
  const possibleIdFields = ['id', '_id', 'sub', 'userId', 'user_id', 'uid'];
  
  for (const field of possibleIdFields) {
    const value = session[field];
    if (value) {
      console.log(`Checking field "${field}":`, typeof value, value);
      
      // If it's a string, validate it
      if (typeof value === 'string') {
        if (mongoose.Types.ObjectId.isValid(value)) {
          console.log(`✅ Found valid ID in "${field}": ${value}`);
          return value;
        }
        console.log(`❌ Invalid ObjectId in "${field}": ${value}`);
      }
      // If it's an object with toString method (like ObjectId)
      else if (value && typeof value.toString === 'function') {
        const strId = value.toString();
        if (mongoose.Types.ObjectId.isValid(strId)) {
          console.log(`✅ Found valid ID in "${field}" (toString): ${strId}`);
          return strId;
        }
        console.log(`❌ Invalid ObjectId in "${field}" (toString): ${strId}`);
      }
    }
  }
  
  console.log("❌ No valid user ID found in session");
  return null;
}

/**
 * Validate that a user exists in the database
 */
async function validateUser(userId: string): Promise<boolean> {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ User not found: ${userId}`);
      return false;
    }
    console.log(`✅ User validated: ${userId} (${user.email})`);
    return true;
  } catch (error) {
    console.error(`Error validating user ${userId}:`, error);
    return false;
  }
}

/**
 * Associate orders with a user by their email
 */
async function associateOrdersWithUser(userId: mongoose.Types.ObjectId, email: string): Promise<number> {
  try {
    const result = await Order.updateMany(
      { 
        customerEmail: email.toLowerCase(), 
        user: null 
      },
      { user: userId }
    );
    console.log(`✅ Associated ${result.modifiedCount} orders with user ${email}`);
    return result.modifiedCount;
  } catch (error) {
    console.error(`Error associating orders for ${email}:`, error);
    return 0;
  }
}

// ==================== GET: Fetch Orders ====================
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] GET /api/orders - Request started`);
  console.log(`[${requestId}] Cookies:`, request.cookies.getAll().map(c => c.name));
  
  try {
    await connectDB();
    console.log(`[${requestId}] Database connected`);

    // Check for admin session first
    const adminSession = await getAuthPayload(request, "admin_token");
    if (adminSession?.role === "admin") {
      console.log(`[${requestId}] Admin access granted - fetching all orders`);
      const allRecords = await Order.find({})
        .sort({ createdAt: -1 })
        .populate('user', 'fullName email');
      
      console.log(`[${requestId}] Found ${allRecords.length} total orders`);
      return NextResponse.json(allRecords, { 
        status: 200,
        headers: {
          'X-Total-Count': allRecords.length.toString()
        }
      });
    }

    // Check for customer session
    const customerSession = await getAuthPayload(request, "token");
    if (!customerSession) {
      console.log(`[${requestId}] No valid session found`);
      return NextResponse.json(
        { error: "Unauthorized. Please log in to view your orders." },
        { status: 401 }
      );
    }

    // Extract user ID from session
    const userId = extractUserId(customerSession);
    if (!userId) {
      console.error(`[${requestId}] No valid user ID in session`);
      return NextResponse.json(
        { 
          error: "Invalid session data. Please log out and log in again.",
          details: "User ID not found in session"
        },
        { status: 401 }
      );
    }

    // Validate that the user exists in the database
    const userExists = await validateUser(userId);
    if (!userExists) {
      console.error(`[${requestId}] User not found in database: ${userId}`);
      return NextResponse.json(
        { 
          error: "User account not found. Please log out and log in again.",
          details: "User ID does not exist in database"
        },
        { status: 404 }
      );
    }

    // Get user details for email association
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // CRITICAL FIX: Associate any orders with matching email but null user
    const associatedCount = await associateOrdersWithUser(
      new mongoose.Types.ObjectId(userId),
      user.email
    );
    
    if (associatedCount > 0) {
      console.log(`[${requestId}] ✅ Fixed ${associatedCount} orders for user ${user.email}`);
    }

    // Query orders for this specific user
    const customerId = new mongoose.Types.ObjectId(userId);
    console.log(`[${requestId}] Querying orders for user: ${userId}`);
    
    const records = await Order.find({ 
      user: customerId 
    }).sort({ createdAt: -1 });
    
    console.log(`[${requestId}] Found ${records.length} orders for user ${userId}`);
    
    // Log order IDs for debugging
    if (records.length > 0) {
      console.log(`[${requestId}] Order IDs:`, records.map(o => o._id));
      console.log(`[${requestId}] Sample order user field:`, records[0].user);
    } else {
      // If no orders found with user ID, check if there are any with matching email
      const emailOrders = await Order.find({ 
        customerEmail: user.email.toLowerCase() 
      });
      if (emailOrders.length > 0) {
        console.log(`[${requestId}] ⚠️ Found ${emailOrders.length} orders with matching email but user: null`);
        // They should have been fixed above, but log it anyway
      }
    }

    return NextResponse.json(records, { 
      status: 200,
      headers: {
        'X-Total-Count': records.length.toString(),
        'X-User-ID': userId,
        'X-Fixed-Orders': associatedCount.toString()
      }
    });

  } catch (error) {
    console.error(`[${requestId}] GET Orders Error:`, error);
    return NextResponse.json(
      { 
        error: "Server error while fetching your orders.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// ==================== POST: Create Order ====================
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] POST /api/orders - Request started`);
  
  try {
    await connectDB();
    console.log(`[${requestId}] Database connected`);

    // Parse request body
    const body = await request.json();
    const { name, email, phone, paymentMethod, cart, total } = body;
    
    console.log(`[${requestId}] Order details:`, {
      name,
      email,
      phone,
      paymentMethod,
      total,
      cartItems: cart?.length || 0
    });

    // Validate required fields
    if (!name || !email || !phone || !cart || !total) {
      console.log(`[${requestId}] Missing required fields`);
      return NextResponse.json(
        { error: "Missing required fields. Please provide name, email, phone, cart, and total." },
        { status: 400 }
      );
    }

    // Get user session if logged in
    const session = await getAuthPayload(request, "token");
    let userId = null;

    if (session) {
      const userIdStr = extractUserId(session);
      if (userIdStr && mongoose.Types.ObjectId.isValid(userIdStr)) {
        // Validate user exists
        const userExists = await validateUser(userIdStr);
        if (userExists) {
          userId = new mongoose.Types.ObjectId(userIdStr);
          console.log(`[${requestId}] Order associated with user: ${userIdStr}`);
        } else {
          console.log(`[${requestId}] User found in session but not in database. Creating guest order.`);
        }
      }
    } else {
      console.log(`[${requestId}] Guest checkout - no user session`);
    }

    // CRITICAL: Create order with user ID
    const newOrder = await Order.create({
      user: userId, // This MUST be set correctly
      customerName: name,
      customerEmail: email.toLowerCase(),
      phone,
      paymentMethod,
      itemsSummary: cart.map((i: any) => `${i.product.name} × ${i.quantity}`).join(", "),
      total,
      status: "Pending"
    });
    
    // Convert ObjectId to string before using slice
    const orderIdStr = newOrder._id.toString();
    const orderNumber = orderIdStr.slice(-6).toUpperCase();
    
    console.log(`[${requestId}] Order created successfully: ${newOrder._id}`);
    console.log(`[${requestId}] Order number: ${orderNumber}`);
    console.log(`[${requestId}] Associated with user: ${userId ? 'Yes' : 'No (guest)'}`);
    
    return NextResponse.json(
      { 
        message: "Order created successfully.",
        orderId: newOrder._id,
        orderNumber: orderNumber,
        associatedUser: userId ? true : false
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(`[${requestId}] POST Order Error:`, error);
    return NextResponse.json(
      { 
        error: "Failed to create your order. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update Order Status (Admin Only) ====================
export async function PUT(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] PUT /api/orders - Request started`);
  
  try {
    await connectDB();
    console.log(`[${requestId}] Database connected`);

    // Verify admin authentication
    const admin = await getAuthPayload(request, "admin_token");
    if (!admin || admin.role !== "admin") {
      console.log(`[${requestId}] Unauthorized - Admin access required`);
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    console.log(`[${requestId}] Admin authenticated: ${admin.email || admin.id}`);

    // Parse request body
    const { id, status } = await request.json();

    if (!id) {
      console.log(`[${requestId}] Missing order ID`);
      return NextResponse.json(
        { error: "Order ID is required." },
        { status: 400 }
      );
    }

    if (!status) {
      console.log(`[${requestId}] Missing status`);
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    // Validate the status
    if (!ALLOWED_STATUSES.includes(status as OrderStatus)) {
      console.log(`[${requestId}] Invalid status: ${status}`);
      return NextResponse.json(
        { 
          error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}` 
        },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Updating order ${id} to status: ${status}`);

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    );
    
    if (!order) {
      console.log(`[${requestId}] Order not found: ${id}`);
      return NextResponse.json(
        { error: `Order with ID ${id} not found.` },
        { status: 404 }
      );
    }

    console.log(`[${requestId}] Order updated successfully: ${id}`);
    
    return NextResponse.json(
      { 
        message: "Order status updated successfully.",
        order: order
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(`[${requestId}] PUT Order Error:`, error);
    return NextResponse.json(
      { 
        error: "Failed to update order status.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete Order (Admin Only) ====================
export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] DELETE /api/orders - Request started`);
  
  try {
    await connectDB();
    console.log(`[${requestId}] Database connected`);

    // Verify admin authentication
    const admin = await getAuthPayload(request, "admin_token");
    if (!admin || admin.role !== "admin") {
      console.log(`[${requestId}] Unauthorized - Admin access required`);
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    console.log(`[${requestId}] Admin authenticated: ${admin.email || admin.id}`);

    // Get order ID from URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      console.log(`[${requestId}] Missing order ID`);
      return NextResponse.json(
        { error: "Order ID is required." },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`[${requestId}] Invalid ObjectId: ${id}`);
      return NextResponse.json(
        { error: "Invalid order ID format." },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Deleting order: ${id}`);

    // Find and delete the order
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      console.log(`[${requestId}] Order not found: ${id}`);
      return NextResponse.json(
        { error: `Order with ID ${id} not found.` },
        { status: 404 }
      );
    }

    console.log(`[${requestId}] Order deleted successfully: ${id}`);
    
    return NextResponse.json(
      { 
        message: "Order deleted successfully.",
        deletedOrderId: id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(`[${requestId}] DELETE Order Error:`, error);
    return NextResponse.json(
      { 
        error: "Failed to delete order.",
        details: error instanceof Error ? error.message : "Unknown error"
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
      'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}