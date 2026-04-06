import axios from "axios";
import { RoundDetailsInputFormSchema, RoundDetailsInputProps } from "@/features/round-details/types/round-details-input";

export async function c_getRoundDetails(rawData: RoundDetailsInputProps) {
    const data = RoundDetailsInputFormSchema.parse(rawData);

    const queryParams: Record<string, string> = {};
    if (data.round_id) {
        queryParams.roundId = data.round_id;
    } else {
        if (data.game_id) queryParams.gameId = data.game_id;
        if (data.user_id) queryParams.userId = data.user_id;
    }

    const axiosConfig = {
        params: queryParams,
        headers: { "Content-Type": "application/json" }
    };

    try {
        const [tptResponse, betResponse] = await Promise.all([
            axios.get("/api/tpttableinfo", axiosConfig),
            axios.get("/api/bettableinfo", axiosConfig)
        ]);

        return {
            tptInfo: tptResponse.data,
            betInfo: betResponse.data
        };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Failed to fetch combined transaction info";
        throw new Error(errorMessage);
    }
}