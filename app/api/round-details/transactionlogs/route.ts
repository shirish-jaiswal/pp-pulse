import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const roundId = searchParams.get("roundId");
        const timeStamp = searchParams.get("timeStamp");

        if (!roundId) {
            return NextResponse.json(
                { error: "roundId is required" },
                { status: 400 }
            );
        }

        const anchorTime = timeStamp ? new Date(timeStamp) : new Date();

        const fromTime = new Date(anchorTime.getTime() - 15 * 60 * 1000).toISOString();
        const toTime = new Date(anchorTime.getTime() + 24 * 60 * 60 * 1000).toISOString();

        const response = await axios.get(
            `${BACKEND_URL}/playerbetlogs/transactionlogs`,
            {
                params: {
                    roundId,
                    from: fromTime,
                    to: toTime,
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