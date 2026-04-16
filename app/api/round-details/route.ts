import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

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
      if (rawData.game_id) externalQueryParams.gameId = rawData.game_id;
      if (rawData.user_id) externalQueryParams.userId = rawData.user_id;
    }

    /**
     * ✅ Extract cookies properly from request
     */
    const cookies = request.cookies.getAll();

    // Convert cookies to string format: "key=value; key2=value2"
    const cookieHeader = cookies
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const axiosConfig = {
      baseURL: BACKEND_URL,
      params: externalQueryParams,
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      withCredentials: true,
    };

    const [tptResponse, betResponse] = await Promise.all([
      axios.get("/tpttableinfo", axiosConfig),
      axios.get("/bettableinfo", axiosConfig),
    ]);

    return NextResponse.json({
      tptInfo: tptResponse.data?.data,
      betInfo: betResponse.data?.data,
    });
  } catch (error: any) {
    console.warn("error", error);

    const errorMessage =
      error.response?.data?.error || error.message || "Request failed";

    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 400 }
    );
  }
}