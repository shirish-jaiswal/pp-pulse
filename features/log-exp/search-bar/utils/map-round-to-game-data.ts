import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";
import { getGameType } from "@/utils/get-game-type";

export interface GameData {
  round_id: string;
  game_id: string;
  user_id: string;
  external_player_id?: string;
  casino_id: string;
  game_started_at: Date;
  game_ended_at: Date;
  isCancled: string;
  game_type: string;
  [key: string]: unknown;
}

export function mapRoundToGameData(data: RoundDetailsResponse): GameData {
  const round_id = String(data.tptInfo?.at(0)?.round_id ?? "").trim();
  const game_id = String(data.tptInfo?.at(0)?.game_id ?? "").trim();
  const user_id = String(data.tptInfo?.at(0)?.user_id ?? "").trim();
  const casino_id = String(data.tptInfo?.at(0)?.casino_id ?? "").trim();

  let transDate = String(data.tptInfo?.at(0)?.trans_date ?? "").trim();

  if (!transDate) {
    transDate = new Date().toISOString();
  }

  const isoString = transDate.endsWith("Z") || transDate.includes("+")
    ? transDate
    : `${transDate.replace(" ", "T")}Z`;

  const baseDate = new Date(isoString);
  const timestamp = isNaN(baseDate.getTime()) ? Date.now() : baseDate.getTime();
  const startDate = new Date(timestamp - 5 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

  const isCancled = String(
    data.gameDetails?.at(0)?.cancelReason !== "" &&
    data.gameDetails?.at(0)?.cancelReason !== null
  ).trim();

  const game_type = String(
    getGameType(data.gameDetails?.at(0)?.game_type)
  ).trim();

  return {
    round_id,
    game_id,
    user_id,
    casino_id,
    game_started_at: startDate,
    game_ended_at: endDate,
    isCancled,
    game_type,
  };
}