import {
  RoundDetailsInputFormSchema,
  RoundDetailsInputProps,
} from "@/features/round-details/types/round-details-input";
import apiRequest from "@/lib/api/api-request";

export async function c_getRoundDetails(rawData: RoundDetailsInputProps) {
  const data = RoundDetailsInputFormSchema.parse(rawData);

  const queryParams: Record<string, string> = {};

  if (data.round_id) {
    queryParams.roundId = data.round_id;
  } else {
    if (data.game_id) queryParams.gameId = data.game_id;
    if (data.user_id) queryParams.userId = data.user_id;
  }

  const [tptResponse, betResponse] = await Promise.all([
    apiRequest<any>({
      method: "GET",
      endpoint: "/tpttableinfo",
      params: queryParams,
      requireCookie: true,
    }),
    apiRequest<any>({
      method: "GET",
      endpoint: "/bettableinfo",
      params: queryParams,
      requireCookie: true,
    }),
  ]);

  if (!tptResponse.success || !betResponse.success) {
    throw new Error(
      tptResponse.message ||
        betResponse.message ||
        "Failed to fetch round details"
    );
  }

  // ✅ Clean return (no guessing nested structure)
  return {
    tptInfo: tptResponse.data,
    betInfo: betResponse.data,
  };
}