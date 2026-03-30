import { NextResponse } from "next/server";
import axios from "axios";
// Import both schemas
import { CasinoDetailsSchema } from "@/features/casino/types/details";
import { CasinoConfigSchema } from "@/features/casino/types/config";
import { OneWalletConfigSchema } from "@/features/casino/types/one-wallet-config";
import { GameConfigArraySchema } from "@/features/casino/types/game-config";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const casinoId = searchParams.get("casinoId");
    const details = searchParams.get("details"); 
    const jsessionId = searchParams.get("jsessionId");

    const BO_BASE = process.env.BACK_OFFICE_PRELIVE_URL;

    // 1. Validation check for parameters
    if (!casinoId || !jsessionId || !details) {
        return NextResponse.json(
            { error: "Missing required parameters: casinoId, jsessionId, or details method." },
            { status: 400 }
        );
    }

    // Define which schema to use based on the 'details' query param
    const schemaMap: Record<string, any> = {
        "getCasino": CasinoDetailsSchema,
        "getCasinoConfig": CasinoConfigSchema,
        "getOneWalletCasino" : OneWalletConfigSchema,
        "getCasinoTables" : GameConfigArraySchema
    };

    const SelectedSchema = schemaMap[details];
    
    // If the 'details' param doesn't match our known methods
    if (!SelectedSchema) {
        return NextResponse.json(
            { error: `Unsupported details method: ${details}` },
            { status: 400 }
        );
    }

    try {
        const targetUrl = `${BO_BASE}/api/casinoService/${details}`;

        const response = await axios.get(targetUrl, {
            params: { casinoId },
            headers: {
                "Cookie": `JSESSIONID=${jsessionId.trim()}`,
                "X-Requested-With": "XMLHttpRequest",
                "Referer": `${BO_BASE}/liveadminconsole/casinomgmt/CasinoDetails.jsp`,
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            validateStatus: (status) => status >= 200 && status < 300
        });

        const existsData = response.data;

        // 2. Business Logic Check
        if (!existsData || existsData.success === false) {
            return NextResponse.json(
                { error: `Casino Id ${casinoId} not found or BO returned failure.` },
                { status: 404 }
            );
        }

        // 3. Dynamic Zod Validation
        const validatedData = SelectedSchema.safeParse(existsData);

        if (!validatedData.success) {
            return NextResponse.json(
                {
                    error: `Data integrity check failed for ${details}.`,
                    details: validatedData.error.issues.map((issue: any) =>
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
        const message = (status === 401 || status === 403) 
            ? "Your BO session has expired or is invalid." 
            : "Failed to fetch data from BackOffice.";

        return NextResponse.json({ error: message }, { status });
    }
}