import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticketId"); 
    
    const body = await request.json();

    if (!ticketId) {
      return NextResponse.json(
        { error: "Missing required parameter: ticketId" },
        { status: 400 }
      );
    }

    const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN; 
    const API_KEY = process.env.FRESHDESK_API_KEY; 

    const authHeader = Buffer.from(`${API_KEY}:X`).toString("base64");

    const targetUrl = `${FRESHDESK_DOMAIN}/v2/tickets/${ticketId}/notes`;

    const response = await axios.post(targetUrl, body, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({
      success: true,
      data: response.data,
    });

  } catch (error: any) {
    console.error("Freshdesk POST Failure:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    return NextResponse.json(
      { 
        error: "Failed to add note to Freshdesk.", 
        details: error.response?.data 
      },
      { status }
    );
  }
}