import axios from "axios";
import { RoundDetailsInputFormSchema } from "@/features/round-details/types/round-details-input";

type BetTableInfoProps = {
    roundId?: string;
    gameId?: string;
    userId?: string;
}

export async function c_getBetTableInfo(rawData: BetTableInfoProps) {
    const data = RoundDetailsInputFormSchema.parse(rawData);

    const queryParams: Record<string, string> = {};

    if (data.round_id) {
        queryParams.roundId = data.round_id;
    } else {
        if (data.game_id) queryParams.gameId = data.game_id;
        if (data.user_id) queryParams.userId = data.user_id;
    }

    try {
        const response = await axios.get("/api/bettableinfo", {
            params: queryParams,
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Failed to fetch transaction info";
        throw new Error(errorMessage);
    }
}