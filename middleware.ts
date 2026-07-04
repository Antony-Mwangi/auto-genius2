import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const adminToken = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Restrict authenticated users from accessing public authentication screens
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/shop", request.url));
  }
  
  if (adminToken && pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 2. Lock down the Admin Management panel explicitly (/admin/dashboard)
  if (pathname.startsWith("/admin/dashboard")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    try {
      // Decode JWT payload using edge-runtime friendly atob() instead of Buffer
      const payloadBase64 = adminToken.split(".")[1];
      if (payloadBase64) {
        // Replace base64url characters to safe base64 before decoding
        const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = atob(base64);
        const decoded = JSON.parse(jsonPayload);
        
        if (decoded.role !== "admin") {
          return NextResponse.redirect(new URL("/admin/login?error=Unauthorized", request.url));
        }
      }
    } catch (e) {
      console.error("Middleware JWT parsing error:", e);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 3. General protected paths requiring standard customer login sessions
  const isProtectedPath = 
    (pathname.startsWith("/dashboard") && !pathname.startsWith("/admin/dashboard")) || 
    pathname.startsWith("/checkout");

  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
  }

  return NextResponse.next();
}

// Configure exactly which routes trigger this middleware hook execution mapping
export const config = {
  matcher: [
    "/login", 
    "/register", 
    "/admin/login",
    "/admin/dashboard",       // ADDED: Catches the exact route root
    "/admin/dashboard/:path*", // Catches any deeply nested management screens
    "/dashboard",             // ADDED: Catches customer route root
    "/dashboard/:path*", 
    "/checkout/:path*"
  ],
};