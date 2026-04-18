import { useQuery } from "@tanstack/react-query";
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input";
import { roundDetailsKeys } from "@/lib/query-key/round-details";
import { c_getRoundDetails } from "@/lib/api/round-details/c_round-details";

export default function useGetRoundDetails(
  params: RoundDetailsInputProps,
  initialData?: any
) {
  const isEnabled =
    !!params.round_id || (!!params.game_id && !!params.user_id);

  return useQuery<any, Error>({
    queryKey: roundDetailsKeys.list(
      params.game_id || "",
      params.user_id || "",
      params.round_id || ""
    ),

    queryFn: () => c_getRoundDetails(params),

    enabled: isEnabled,

    initialData,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev : any) => prev,
  });
}