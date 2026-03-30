import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const casinoId = searchParams.get("casinoId");
        const ccCookie = searchParams.get("ccCookie");

        const CC_BASE = process.env.COMMAND_CENTER;

        // ✅ Validate params
        if (!casinoId || !ccCookie) {
            return NextResponse.json(
                { error: "Missing required parameters: casinoId or ccCookie." },
                { status: 400 }
            );
        }

        const targetUrl = `${CC_BASE}/casino_conf/assignunassign/report`;

        const response = await axios.get(targetUrl, {
            params: { casinoIds: casinoId },
            headers: {
                Authorization: `Bearer ${ccCookie}`,
                "X-Requested-With": "XMLHttpRequest",
                Accept: "*/*" // 👈 important (not JSON)
            },
            responseType: "text", // 👈 VERY IMPORTANT (CSV response)
            validateStatus: (status) => status >= 200 && status < 300
        });

        const rawData = response.data;
        console.log(response)
        // ✅ Convert CSV → JSON
        const lines = rawData.split("\n").filter(Boolean);

        const headers = lines[0]
            .split(",")
            .map((h: string) => h.trim());

        const parsedData = lines.slice(1).map((line: string) => {
            const values = line.split(",");

            const obj: any = {};
            headers.forEach((header: string, index: number) => {
                obj[header] = values[index]?.trim() || "";
            });

            return obj;
        });

        // ✅ Business check
        if (!parsedData.length) {
            return NextResponse.json(
                { error: `No data found for casinoId ${casinoId}` },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            count: parsedData.length,
            data: parsedData
        });

    } catch (error: any) {
        console.error("BO API Failure:", error.response?.data || error.message);

        const status = error.response?.status || 500;

        const message =
            status === 401 || status === 403
                ? "Your BO session/token is invalid or expired."
                : "Failed to fetch data from BackOffice.";

        return NextResponse.json({ error: message }, { status });
    }
}