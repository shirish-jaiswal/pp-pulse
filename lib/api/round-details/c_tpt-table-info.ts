import {
  RoundDetailsInputFormSchema,
  RoundDetailsInputProps,
} from "@/features/round-details/types/round-details-input";
import apiRequest from "@/lib/api/api-request";

export async function c_tptTableInfo(rawData: RoundDetailsInputProps): Promise<any> {
  try {
    const data = RoundDetailsInputFormSchema.parse(rawData);

    const queryParams: Record<string, any> = {};

    if (data.round_id) {
      queryParams.roundId = data.round_id;
    } else {
      if (data.game_id) queryParams.gameId = data.game_id;
      if (data.user_id) queryParams.userId = data.user_id;
    }

    console.log("queryParams", queryParams);
    const response = await apiRequest({
      method: "GET",
      endpoint: "tpttableinfo",
      params: queryParams,
      requireCookie: true,
    });

    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching TPT Table Info:", error);
    return null;
  }
}