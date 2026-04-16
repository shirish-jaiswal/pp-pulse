import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("JSESSIONID")?.value;
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/login";

  const isPublicRoute =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  // Allow static & API routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // ❌ No token → only allow login page
  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ✅ Token exists → block login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // ✅ Token exists → allow everything else
  return NextResponse.next();
}