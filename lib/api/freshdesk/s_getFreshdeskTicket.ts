"use server";

import apiRequest from "@/lib/api/api-request";
import c_getDecryptedFdKey from "./c_getDecryptedFdKey";

export async function s_getFreshdeskTicket(ticketId: string, ) {
  try {
    if (!ticketId) {
      throw new Error("Missing ticketId");
    }
      const fdKey = await c_getDecryptedFdKey();
    const DOMAIN = process.env.NEXT_PUBLIC_FRESHDESK_DOMAIN!;
    const authHeader = Buffer.from(`${fdKey}:X`).toString("base64");
    const headers = {
      Authorization: `Basic ${authHeader}`,
    };

    const [ticket, conversations] = await Promise.all([
      apiRequest({
        method: "GET",
        endpoint: `/v2/tickets/${ticketId}`,
        baseURL: DOMAIN,
        headers,
        requireCookie: false,
      }),
      apiRequest({
        method: "GET",
        endpoint: `/v2/tickets/${ticketId}/conversations`,
        baseURL: DOMAIN,
        headers,
        requireCookie: false,
      }),
    ]);

    return {
      success: true,
      ticket: ticket ?? null,
      conversations: conversations ?? [],
    };
  } catch (error: any) {
    console.error(
      "Freshdesk Fetch Error:",
      error?.response?.data || error.message
    );

    return {
      success: false,
      ticket: null,
      conversations: [],
      userEmail: null,
    };
  }
}