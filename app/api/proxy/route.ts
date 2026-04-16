import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, method = "GET", headers: customHeaders = {}, body: requestBody } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
    };

    if (requestBody && method !== "GET" && method !== "HEAD") {
      fetchOptions.body =
        typeof requestBody === "string" ? requestBody : JSON.stringify(requestBody);
    }

    const response = await fetch(url, fetchOptions);

    const contentType = response.headers.get("content-type") || "";
    let data: unknown;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data,
      ok: response.ok,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown proxy error";
    return NextResponse.json(
      { error: message, status: 500 },
      { status: 500 }
    );
  }
}