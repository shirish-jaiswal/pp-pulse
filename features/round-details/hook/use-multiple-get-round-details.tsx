import { useQueries } from "@tanstack/react-query";
import { c_getRoundDetails } from "@/lib/api/round-details/c_round-details";
import { roundDetailsKeys } from "@/lib/query-key/round-details";
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input";

type Params = {
  ids: string[];
  mode: "round" | "game";
  user_id?: string;
  enabled: boolean; // 🔥 manual trigger
};

export function useGetMultipleRoundDetails({
  ids,
  mode,
  user_id,
  enabled,
}: Params) {
  return useQueries({
    queries: ids.map((id) => {
      const params: RoundDetailsInputProps =
        mode === "game"
          ? { game_id: id, user_id }
          : { round_id: id };

      return {
        queryKey: roundDetailsKeys.list(
          params.game_id || "",
          params.user_id || "",
          params.round_id || ""
        ),

        queryFn: () => c_getRoundDetails(params),

        // 🔥 ONLY FETCH WHEN ENABLED
        enabled:
          enabled &&
          (mode === "round"
            ? !!params.round_id
            : !!params.game_id && !!params.user_id),

        staleTime: 1000 * 60 * 5,
      };
    }),
  });
}