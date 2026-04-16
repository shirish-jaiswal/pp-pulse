//app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();


    // 1. Forward request to the actual backend
    const response = await axios.post(
      `${BACKEND_URL}/auth/login`,
      {
        email: body.email,
        password: body.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials on server-to-server calls is usually unnecessary
        // unless your backend requires it for specific auth
      }
    );

    // 2. Initialize the Next.js response
    const nextResponse = NextResponse.json(
      { success: true, data: response.data },
      { status: 200 }
    );

    // 3. Extract cookies from backend and proxy them to the browser
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      // IMPORTANT: Loop and append. Do NOT use .set() with .join(",")
      // Joining with commas breaks cookies that have 'Expires=Mon, 01-Jan...'
      setCookieHeader.forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error("❌ Proxy Login Error:", error?.response?.data || error.message);

    const errorMessage = error.response?.data?.error || "Login request failed";
    const status = error.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}