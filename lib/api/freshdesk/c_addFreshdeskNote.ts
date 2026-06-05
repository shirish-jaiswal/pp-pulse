"use server";

import apiRequest from "../api-request";
import c_getDecryptedFdKey from "./c_getDecryptedFdKey";

export async function c_addFreshdeskNote(
  ticketId: string, 
  htmlContent: string
) {
  try {
    if (!ticketId) {
      throw new Error("Missing ticketId");
    }
    if (!htmlContent) {
      throw new Error("Missing content for the note");
    }

    const fdKey = await c_getDecryptedFdKey();
    
    if (!fdKey) {
      throw new Error("Could not retrieve a valid Freshdesk API key.");
    }

    const DOMAIN = process.env.NEXT_PUBLIC_FRESHDESK_DOMAIN!;
    
    const authHeader = btoa(`${fdKey}:X`);
    
    const headers = {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    };

    const response = await apiRequest({
      method: "POST",
      endpoint: `/v2/tickets/${ticketId}/notes`,
      baseURL: DOMAIN,
      headers,
      requireCookie: false,
      body: {
        body: htmlContent,
        private: true, 
      },
    });

    return {
      success: true,
      note: response ?? null,
    };
  } catch (error: any) {
    console.error(
      "Freshdesk Note Post Error:",
      error?.message || error
    );

    return {
      success: false,
      error: error?.message || "Unknown error occurred while posting note.",
    };
  }
}