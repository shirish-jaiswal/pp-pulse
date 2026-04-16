import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const roundId = searchParams.get("roundId");

        if (!roundId) {
            return NextResponse.json(
                { error: "roundId is required" },
                { status: 400 }
            );
        }

        const response = await axios.get(
            `${BACKEND_URL}/gamedetails`,
            {
                params: {
                    RoundId: roundId,
                },
            }
        );

        return NextResponse.json({
            transactionLogs: response.data,
        });

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data || "Backend error" },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}