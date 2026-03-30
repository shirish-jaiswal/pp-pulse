import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticketId");

    if (!ticketId) {
      return NextResponse.json(
        { error: "Missing required parameter: ticketId" },
        { status: 400 }
      );
    }

    const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN;
    const API_KEY = process.env.FRESHDESK_API_KEY;
    const authHeader = Buffer.from(`${API_KEY}:X`).toString("base64");

    const config = {
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
    };

    // 1. Define target URLs
    const ticketUrl = `${FRESHDESK_DOMAIN}/v2/tickets/${ticketId}`;
    const conversationsUrl = `${FRESHDESK_DOMAIN}/v2/tickets/${ticketId}/conversations`;

    // 2. Fetch both concurrently
    const [ticketResponse, conversationsResponse] = await Promise.all([
      axios.get(ticketUrl, config),
      axios.get(conversationsUrl, config),
    ]);

    // 3. Return combined data
    return NextResponse.json({
      success: true,
      ticket: ticketResponse.data,
      conversations: conversationsResponse.data,
    });

  } catch (error: any) {
    console.error("Freshdesk API Failure:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    return NextResponse.json(
      { 
        error: "Failed to fetch ticket data from Freshdesk.", 
        details: error.response?.data 
      },
      { status }
    );
  }
}