import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input";
import { roundDetailsKeys } from "@/lib/query-key/round-details";

export default function useGetRoundDetails(
    params: RoundDetailsInputProps,
    initialData?: any
) {
    return useQuery<any, Error>({
        queryKey: roundDetailsKeys.list(
            params.game_id || "",
            params.user_id || "",
            params.round_id || "",
        ),
        queryFn: async () => {
            // 1. Build the search parameters for the URL
            const searchParams = new URLSearchParams();
            if (params.round_id) searchParams.append("roundId", params.round_id);
            if (params.game_id) searchParams.append("gameId", params.game_id);
            if (params.user_id) searchParams.append("userId", params.user_id);

            // 2. Call your internal API route
            const { data } = await axios.get(`/api/round-details?${searchParams.toString()}`);
            return data;
        },
        // Only run the query if we have a round_id OR both game_id and user_id
        enabled: true,
        initialData,
        staleTime: 1000 * 60 * 5,
        placeholderData: (prev: any) => prev,
    });
}