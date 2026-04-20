import {
  RoundDetailsInputFormSchema,
  RoundDetailsInputProps,
} from "@/features/round-details/types/round-details-input";
import axios from "axios";
import { cookies } from "next/headers";

const NEXT_URL = process.env.NEXT_PUBLIC_NEXT_URL;

export async function getRoundDetails(rawData: RoundDetailsInputProps) {
  const data = RoundDetailsInputFormSchema.parse(rawData);
  const queryParams: Record<string, string> = {};
  if (data.round_id) {
    queryParams.roundId = data.round_id;
  } else {
    if (data.game_id) queryParams.gameId = data.game_id;
    if (data.user_id) queryParams.userId = data.user_id;
  }


  const cookiess = await cookies();
  const cookie = cookiess.get("JSESSIONID")?.value ?? "";
console.log("Cookies :: ", cookie);
  const response = await axios.get(NEXT_URL + "/round-details", {
    params: queryParams,
    headers: {
      "Content-Type": "application/json",
      "cookie": `JSESSIONID=${cookie}`,
    },
  });
  return response.data?.data ?? response.data;
}

