import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getSessionCookie } from "@/lib/api/cookies";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  console.log("➡️ Incoming request:", request.cookies);

  try {
    const { searchParams } = new URL(request.url);
    console.log("🔍 Parsed searchParams:", Object.fromEntries(searchParams));

    const rawData = {
      round_id: searchParams.get("roundId"),
      game_id: searchParams.get("gameId"),
      user_id: searchParams.get("userId"),
    };
    console.log("📦 Raw data:", rawData);

    const externalQueryParams: Record<string, string> = {};

    if (rawData.round_id) {
      console.log("✅ Using round_id");
      externalQueryParams.roundId = rawData.round_id;
    } else {
      console.log("⚠️ No round_id, falling back to game_id/user_id");

      if (rawData.game_id) {
        console.log("➡️ Adding game_id");
        externalQueryParams.gameId = rawData.game_id;
      }

      if (rawData.user_id) {
        console.log("➡️ Adding user_id");
        externalQueryParams.userId = rawData.user_id;
      }
    }

    console.log("🌐 External query params:", externalQueryParams);

    const sessionCookie = await getSessionCookie();
    console.log("sessionCookie ++ :", sessionCookie);

    const axiosConfig = {
      baseURL: BACKEND_URL,
      params: externalQueryParams,
      headers: {
        "Content-Type": "application/json",
        ...(sessionCookie ? { Cookie: sessionCookie } : {}),
      },
    };

    console.log("⚙️ Axios config:", axiosConfig);

    console.log("🚀 Sending parallel requests...");

    const [tptResponse, betResponse] = await Promise.all([
      axios.get("/tpttableinfo", axiosConfig),
      axios.get("/bettableinfo", axiosConfig),
    ]);

    console.log("✅ TPT response:", tptResponse.data);
    console.log("✅ BET response:", betResponse.data);

    const responsePayload = {
      data: {
        tptInfo: tptResponse.data?.data ?? tptResponse.data,
        betInfo: betResponse.data?.data ?? betResponse.data,
      },
    };

    console.log("📤 Final response:", responsePayload);

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.log("SERVER ERROR");
    console.warn("❌ round-details error:");
    console.warn("Status:", error?.response?.status);
    console.warn("Data:", error?.response?.data);
    console.warn("Message:", error?.message);

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Request failed";

    console.log("📤 Sending error response:", errorMessage);

    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 400 }
    );
  }
}