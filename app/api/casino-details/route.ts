import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getSessionCookie } from "@/lib/api/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const casinoId = searchParams.get("casinoid");

        if (!casinoId || !casinoId.trim()) {
            return NextResponse.json(
                { error: "casinoid is required" },
                { status: 400 }
            );
        }

        const sessionCookie = await getSessionCookie();

        const response = await axios.get(`${BACKEND_URL}/casinodetails`, {
            params: { casinoid: casinoId.trim() },
            headers: {
                "Content-Type": "application/json",
                ...(sessionCookie ? { Cookie: sessionCookie } : {}),
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Request failed";

        return NextResponse.json(
            { error: errorMessage },
            { status: error.response?.status || 500 }
        );
    }
}
