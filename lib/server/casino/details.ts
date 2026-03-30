import { CasinoDetailsFormType, CasinoDetailsFormSchema } from "@/features/casino/types/casino-details-input";
import { getSessionData } from "@/utils/storage/local/session-operations";

export async function c_getCasinoDetails(rawData : CasinoDetailsFormType) {
    const data = CasinoDetailsFormSchema.parse(rawData);
    const session = getSessionData();
    const params = new URLSearchParams({
        jsessionId: session.jsessionId,
        casinoId: data.casinoId,
        details: data.details
    });

    const response = await fetch(`/api/pre-live/casino-details?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch transaction info");
    }

    return response.json();
}