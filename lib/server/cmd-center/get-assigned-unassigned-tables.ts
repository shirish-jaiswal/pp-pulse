import { getSessionData } from "@/utils/storage/local/session-operations";

export async function c_getAssignedUnassignedTables(casinoId : string) {
    const session = getSessionData();
    const params = new URLSearchParams({
        ccCookie: session.cc_cookie,
        casinoId: casinoId.toString(),
    });

    const response = await fetch(`/api/cmd-center/assigned-tables?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.log(response)
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch transaction info");
    }

    return response.json();
}