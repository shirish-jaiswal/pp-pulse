import axios from "axios";
import { RoundDetailsInputFormSchema } from "@/features/round-details/types/round-details-input";

const BACKEND_URL = process.env.NEXT_PUBLIC_NEXT_URL;

type TptTableInfoProps = {
    roundId?: string;
    gameId?: string;
    userId?: string;
};

export async function c_tptTableInfo(rawData: TptTableInfoProps) {
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
            `${BACKEND_URL}/tpttableinfo`,
            {
                params: queryParams,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.error ||
                "Failed to fetch transaction info";
            throw new Error(errorMessage);
        }

        throw new Error("Unexpected error occurred");
    }
}