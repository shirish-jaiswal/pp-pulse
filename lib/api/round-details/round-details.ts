import {
  RoundDetailsInputFormSchema,
  RoundDetailsInputProps,
} from "@/features/round-details/types/round-details-input";
import { axiosClient } from "@/lib/api/axios-client";

export async function c_getRoundDetails(rawData: RoundDetailsInputProps) {
  const data = RoundDetailsInputFormSchema.parse(rawData);

  const queryParams: Record<string, string> = {};

  if (data.round_id) {
    queryParams.roundId = data.round_id;
  } else {
    if (data.game_id) queryParams.gameId = data.game_id;
    if (data.user_id) queryParams.userId = data.user_id;
  }

  const response = await axiosClient.get("/round-details", {
    params: queryParams,
  });

  return response.data?.data ?? response.data;
}