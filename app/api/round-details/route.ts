import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getSessionCookie } from "@/lib/api/cookies";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);

    const rawData = {
      round_id: searchParams.get("roundId"),
      game_id: searchParams.get("gameId"),
      user_id: searchParams.get("userId"),
    };

    const externalQueryParams: Record<string, string> = {};

    if (rawData.round_id) {
      externalQueryParams.roundId = rawData.round_id;
    } else {

      if (rawData.game_id) {
        externalQueryParams.gameId = rawData.game_id;
      }

      if (rawData.user_id) {
        externalQueryParams.userId = rawData.user_id;
      }
    }


    const sessionCookie = await getSessionCookie();

    const axiosConfig = {
      baseURL: BACKEND_URL,
      params: externalQueryParams,
      headers: {
        "Content-Type": "application/json",
        ...(sessionCookie ? { Cookie: sessionCookie } : {}),
      },
    };

    const [tptResponse, betResponse] = await Promise.all([
      axios.get("/tpttableinfo", axiosConfig),
      axios.get("/bettableinfo", axiosConfig),
    ]);

    const responsePayload = {
      data: {
        tptInfo: tptResponse.data?.data ?? tptResponse.data,
        betInfo: betResponse.data?.data ?? betResponse.data,
      },
    };


    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.warn("❌ round-details error:");
    console.warn("Status:", error?.response?.status);
    console.warn("Data:", error?.response?.data);
    console.warn("Message:", error?.message);

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Request failed";


    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 400 }
    );
  }
}