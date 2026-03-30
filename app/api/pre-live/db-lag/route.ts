import { NextResponse } from "next/server";
import axios from "axios";
import { CasinoDetailsSchema } from "@/features/casino/types/details";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const jsessionId = searchParams.get("jsessionId");

    const BO_BASE = process.env.BACK_OFFICE_PRELIVE_URL;

    if (!jsessionId) {
        return NextResponse.json(
            { error: "Session Expired or Missing Parameters." },
            { status: 400 }
        );
    }

    try {
        const headers = {
            "Cookie": `JSESSIONID=${jsessionId}`,
            "X-Requested-With": "XMLHttpRequest",
            "Referer": `${BO_BASE}/liveadminconsole/content.jsp`,
            "Accept": "*/*",
            "User-Agent": "Mozilla/5.0"
        };


        // 1. Existence Check
        const casinoDetails = await axios.get(`${BO_BASE}/api/reports/dbLag`,
            {
                headers: {
                    ...headers
                },
                validateStatus: (status) => status >= 200 && status < 300
            }
        );

        const existsData = casinoDetails.data;

        if (!existsData || existsData.success === false || !existsData.userId) {
            return NextResponse.json(
                { status: 404 }
            );
        }

        const validatedData = CasinoDetailsSchema.safeParse(existsData);

        if (!validatedData.success) {
            return NextResponse.json(
                {
                    error: "Data integrity check failed.",
                    details: validatedData.error.issues.map(issue =>
                        `${issue.path.join('.')}: ${issue.message}`
                    )
                },
                { status: 422 }
            );
        }

        return NextResponse.json(validatedData.data);

    } catch (error: any) {
        console.error("BO API Failure:", error.response?.data || error.message);
        const status = error.response?.status || 500;

        if (status === 401 || status === 403) {
            return NextResponse.json({ error: "Your BO session has expired." }, { status: 401 });
        }

        return NextResponse.json({ error: "Failed to fetch round data." }, { status });
    }
}