import { NextRequest } from "next/server";

export function getSessionCookie(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.startsWith("JSESSIONID="))
    .join("; ");
}