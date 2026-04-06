import { useQuery } from "@tanstack/react-query";
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input";
import { c_getRoundDetails } from "@/lib/api/round-details/round-details";
import { roundDetailsKeys } from "@/lib/query-key/round-details";

export function usePlayerBetTxnInfo(
    params: RoundDetailsInputProps,
    initialData?: any
) {
    return useQuery<any, Error>({
        queryKey: roundDetailsKeys.list(
            params.game_id || "",
            params.user_id || "",
            params.round_id || "",
        ),
        queryFn: () => c_getRoundDetails(params),
        enabled: !!params.game_id && (!!params.user_id || !!params.round_id),
        initialData,
        staleTime: 1000 * 60 * 5,
        placeholderData: (prev: any) => prev,
    });
}