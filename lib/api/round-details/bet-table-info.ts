import axios from "axios";
import { RoundDetailsInputFormSchema } from "@/features/round-details/types/round-details-input";

const BACKEND_URL = process.env.NEXT_PUBLIC_NEXT_URL;

type BetTableInfoProps = {
    roundId?: string;
    gameId?: string;
    userId?: string;
};

export async function c_getBetTableInfo(rawData: BetTableInfoProps) {
    if (!BACKEND_URL) {
        throw new Error("NEXT_PUBLIC_NEXT_URL is not defined");
    }

    const normalizedData = {
        round_id: rawData.roundId,
        game_id: rawData.gameId,
        user_id: rawData.userId,
    };

    const data = RoundDetailsInputFormSchema.parse(normalizedData);

    const queryParams: Record<string, string> = {};

    if (data.round_id) {
        queryParams.roundId = data.round_id;
    } else {
        if (data.game_id) queryParams.gameId = data.game_id;
        if (data.user_id) queryParams.userId = data.user_id;
    }

    try {
        const response = await axios.get(
            `${BACKEND_URL}/bettableinfo`,
            {
                params: queryParams,
            }
        );

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("CLIENT ERROR:", error.response || error.message);

            throw new Error(
                error.response?.data?.error ||
                "Failed to fetch transaction info"
            );
        }

        throw new Error("Unexpected error occurred");
    }
}