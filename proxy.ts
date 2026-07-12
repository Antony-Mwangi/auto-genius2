// // import { NextResponse, type NextRequest } from "next/server";

// // export function middleware(request: NextRequest) {
// //   const token = request.cookies.get("token")?.value;
// //   const adminToken = request.cookies.get("admin_token")?.value;
// //   const { pathname } = request.nextUrl;

// //   // 1. Restrict authenticated users from accessing public authentication screens
// //   if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
// //     return NextResponse.redirect(new URL("/dashboard", request.url));
// //   }
  
// //   if (adminToken && pathname.startsWith("/admin/login")) {
// //     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
// //   }

// //   // 2. Lock down the Admin Management panel explicitly (/admin/dashboard)
// //   if (pathname.startsWith("/admin/dashboard")) {
// //     if (!adminToken) {
// //       return NextResponse.redirect(new URL("/admin/login", request.url));
// //     }
    
// //     try {
// //       // Decode JWT payload using edge-runtime friendly atob() instead of Buffer
// //       const payloadBase64 = adminToken.split(".")[1];
// //       if (payloadBase64) {
// //         // Replace base64url characters to safe base64 before decoding
// //         const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
// //         const jsonPayload = atob(base64);
// //         const decoded = JSON.parse(jsonPayload);
        
// //         if (decoded.role !== "admin") {
// //           return NextResponse.redirect(new URL("/admin/login?error=Unauthorized", request.url));
// //         }
// //       }
// //     } catch (e) {
// //       console.error("Middleware JWT parsing error:", e);
// //       return NextResponse.redirect(new URL("/admin/login", request.url));
// //     }
// //   }

// //   // 3. Protected paths requiring standard customer login sessions
// //   // REMOVED: pathname.startsWith("/checkout") to allow anonymous guest transactions safely
// //   const isProtectedPath = pathname.startsWith("/dashboard") && !pathname.startsWith("/admin/dashboard");

// //   if (!token && isProtectedPath) {
// //     return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
// //   }

// //   return NextResponse.next();
// // }

// // // Configure exactly which routes trigger this middleware hook execution mapping
// // export const config = {
// //   matcher: [
// //     "/login", 
// //     "/register", 
// //     "/admin/login",
// //     "/admin/dashboard",       
// //     "/admin/dashboard/:path*", 
// //     "/dashboard",             
// //     "/dashboard/:path*"
// //   ],
// // };




// // middleware.ts
// import { NextResponse, type NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET || "fallback_secret"
// );

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const adminToken = request.cookies.get("admin_token")?.value;
//   const { pathname } = request.nextUrl;

//   // 1. Restrict authenticated users from accessing public authentication screens
//   if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
  
//   if (adminToken && pathname.startsWith("/admin/login")) {
//     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//   }

//   // 2. Lock down the Admin Management panel explicitly (/admin/dashboard)
//   if (pathname.startsWith("/admin/dashboard")) {
//     if (!adminToken) {
//       return NextResponse.redirect(new URL("/admin/login", request.url));
//     }
    
//     try {
//       const { payload } = await jwtVerify(adminToken, JWT_SECRET);
      
//       if (payload.role !== "admin") {
//         return NextResponse.redirect(new URL("/admin/login?error=Unauthorized", request.url));
//       }
//     } catch (e) {
//       console.error("Middleware JWT parsing error:", e);
//       return NextResponse.redirect(new URL("/admin/login", request.url));
//     }
//   }

//   // 3. Protected paths requiring standard customer login sessions
//   const isProtectedPath = pathname.startsWith("/dashboard") && !pathname.startsWith("/admin/dashboard");

//   if (!token && isProtectedPath) {
//     return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
//   }

//   // 4. ADDED: Verify customer token for API routes
//   if (pathname.startsWith("/api/orders") && request.method === "GET") {
//     // For GET requests, we need to verify the user is authenticated
//     // The API itself will handle the verification, but we can add a check here
//     if (!token && !adminToken) {
//       return NextResponse.json(
//         { message: "Unauthorized. Please log in." },
//         { status: 401 }
//       );
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/login", 
//     "/register", 
//     "/admin/login",
//     "/admin/dashboard",       
//     "/admin/dashboard/:path*", 
//     "/dashboard",             
//     "/dashboard/:path*",
//     "/api/orders/:path*",    // ADDED: Include API routes
//   ],
// };



// proxy.ts (formerly middleware.ts)
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret"
);

// Rename from middleware to proxy
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const adminToken = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  // Restrict authenticated users from accessing public auth screens
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  if (adminToken && pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Lock down admin panel
  if (pathname.startsWith("/admin/dashboard")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    try {
      const { payload } = await jwtVerify(adminToken, JWT_SECRET);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login?error=Unauthorized", request.url));
      }
    } catch (e) {
      console.error("Proxy JWT parsing error:", e);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protected customer paths
  const isProtectedPath = pathname.startsWith("/dashboard") && !pathname.startsWith("/admin/dashboard");
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
  }

  return NextResponse.next();
}

// Update the config export (if you're using it)
export const config = {
  matcher: [
    "/login", 
    "/register", 
    "/admin/login",
    "/admin/dashboard",       
    "/admin/dashboard/:path*", 
    "/dashboard",             
    "/dashboard/:path*",
  ],
};