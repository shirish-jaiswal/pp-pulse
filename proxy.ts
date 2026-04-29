import { NextRequest, NextResponse } from "next/server";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const session = req.cookies.get("JSESSIONID")?.value;
  const userToken = req.cookies.get("user_token")?.value;

  const isPublicRoute =
    pathname === "/portal/login" ||
    pathname === "/not-allowed" ||
    pathname === "/not-found";

  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  if (isPublicRoute || isPublicAsset) {
    // If logged in and trying to access login, send to home
    if (pathname === "/portal/login" && session) {
      return NextResponse.redirect(new URL("/portal/home", req.url));
    }
    return NextResponse.next();
  }

  // 2. AUTH WALL
  if (!session) {
    return NextResponse.redirect(new URL("/portal/login", req.url));
  }

  // 3. RBAC LOGIC
  try {
    if (!userToken) return NextResponse.next();

    const payload = parseJwt(userToken);
    const roles = payload?.role?.split(",").map((r: string) => r.trim()).filter(Boolean) || [];

    if (roles.length === 0) return NextResponse.next();

    const query = roles.map((r: string) => `roles_like=${encodeURIComponent(r)}`).join("&");

    const res = await fetch(
      `${origin}/portal/api/excel-db/rbac/tables/feature_list/rows?${query}`,
      {
        headers: { cookie: req.headers.get("cookie") || "" },
        cache: "no-store",
      }
    );

    const json = await res.json();
    const rows = json?.data?.rows ?? [];

    const hasAccess = rows.some((item: any) => pathname.startsWith(item.path));

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/portal/not-allowed", req.url));
    }
  } catch (err) {
    console.error("Proxy RBAC error:", err);
  }

  return NextResponse.next();
}

// 4. MATCHER (Remains the same)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};