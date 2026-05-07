import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  const cookieOptions = {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
  };

  response.cookies.set("JSESSIONID", "", cookieOptions);

  response.cookies.set("user_token", "", cookieOptions);

  return response;
}