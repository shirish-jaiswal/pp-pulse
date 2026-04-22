import {
  RoundDetailsInputFormSchema,
  RoundDetailsInputProps,
} from "@/features/round-details/types/round-details-input";
import apiRequest from "@/lib/api/api-request";

export async function c_getRoundDetails(rawData: RoundDetailsInputProps) : Promise<any> {
  try {
    const data = RoundDetailsInputFormSchema.parse(rawData);

    const queryParams: Record<string, any> = {};

    if (data.round_id) {
      queryParams.roundId = data.round_id;
    } else {
      if (data.game_id) queryParams.gameId = data.game_id;
      if (data.user_id) queryParams.userId = data.user_id;
    }

    const [tptInfo, betInfo] = await Promise.all([
      apiRequest({
        method: "GET",
        endpoint: "tpttableinfo",
        params: queryParams,
        requireCookie: true,
      }),
      apiRequest({
        method: "GET",
        endpoint: "bettableinfo",
        params: queryParams,
        requireCookie: true,
      }),
    ]);

    return {
      tptInfo : tptInfo?.data,
      betInfo : betInfo?.data,
    };
  } catch (error) {
    return {
      tptInfo: null,
      betInfo: null,
    };
  }
}
