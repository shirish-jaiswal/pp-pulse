import { useQuery } from "@tanstack/react-query";
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input";
import { c_tptTableInfo } from "@/lib/api/round-details/c_tpt-table-info";
import { tptTableKeys } from "@/lib/query-key/tpt-table-info";

export default function useGetTptTableInfo(
  params: RoundDetailsInputProps,
  initialData?: any
) {
  const isEnabled =
    !!params.round_id || (!!params.game_id && !!params.user_id);

  return useQuery<any, Error>({
    queryKey: tptTableKeys.list({
      roundId: params.round_id || "",
      gameId: params.game_id || "",
      userId: params.user_id || "",
    }),

    queryFn: () => c_tptTableInfo(params),

    enabled: isEnabled,

    initialData,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev: any) => prev,
  });
}