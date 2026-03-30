import { PlayerBetTxnInfoProps, PlayerBetTxnInfoSchema } from "@/types/round-details-input";
import { getSessionData } from "@/utils/storage/local/session-operations";

export async function c_getPlayerBetTxnInfo(rawData: PlayerBetTxnInfoProps) {
    const data = PlayerBetTxnInfoSchema.parse(rawData);
    const session = getSessionData();

    const params = new URLSearchParams({
        jsessionId: session.jsessionId,
        typeParam: data.gameParamId,
        gameId: data.game_id,
        playerParamId: data.playerParamId,
        playerParamValue: data.user_id ? data.user_id : "", 
    });

    const response = await fetch(`/api/pre-live/round-details?${params.toString()}`, {
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