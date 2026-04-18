import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("JSESSIONID")?.value;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/login";
  const isPublicRoute =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");
  pathname.includes("/")

  if (isPublicRoute) return NextResponse.next();

  if (!token) {
    if (!isLoginPage)
      return NextResponse.redirect(new URL("/portal/login", req.url));
    return NextResponse.next();
  }
  if (token && isLoginPage)
    return NextResponse.redirect(new URL("/portal/home", req.url));

  else return NextResponse.next();
}