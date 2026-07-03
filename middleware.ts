import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. If user is logged in, restrict them from hitting auth pages like /login or /register
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/shop", request.url));
  }

  // 2. Define protected paths that strictly require a login session
  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/checkout");

  if (!token && isProtectedPath) {
    // Redirect them to login, appending a redirect query so they return post-login
    return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
  }

  return NextResponse.next();
}

// Configure exactly which routes trigger this middleware
export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/checkout/:path*"],
};