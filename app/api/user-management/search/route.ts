import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getSessionCookie } from "@/lib/api/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const emailAddress = searchParams.get("emailAddress");
        const userId = searchParams.get("userId");

        if (!emailAddress && !userId) {
            return NextResponse.json(
                { error: "Either emailAddress or userId is required" },
                { status: 400 }
            );
        }

        if (emailAddress && userId) {
            return NextResponse.json(
                { error: "Provide only one: emailAddress OR userId" },
                { status: 400 }
            );
        }

        const sessionCookie = await getSessionCookie();
        const params: Record<string, string> = {};

        if (emailAddress) params.emailAddress = emailAddress.trim();
        if (userId) params.userId = userId.trim();

        const response = await axios.get(`${BACKEND_URL}/user-management/search`, {
            params,
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
