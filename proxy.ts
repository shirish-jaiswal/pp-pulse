import { NextRequest, NextResponse } from "next/server";

const F_DOMAIN =
  process.env.NEXT_PUBLIC_NEXT_URL || "http://localhost:3000";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = req.cookies.get("JSESSIONID")?.value;

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/not-allowed" ||
    pathname === "/not-found";

  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  // Allow public routes/assets
  if (isPublicRoute || isPublicAsset) {
    // If already logged in, redirect login -> home
    if (pathname === "/login" && session) {
      return NextResponse.redirect(
        new URL("/portal/home", req.url)
      );
    }

    return NextResponse.next();
  }

  // Auth check only
  if (!session) {
    return NextResponse.redirect(
      new URL("/portal/login", req.url)
    );
  }

  return NextResponse.next();
}

// Matcher
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};