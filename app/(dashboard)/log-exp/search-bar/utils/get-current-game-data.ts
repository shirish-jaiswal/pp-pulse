import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";
import { getGameType } from "@/utils/get-game-type";

export interface GameData {
    round_id: string;
    game_id: string;
    user_id: string;
    external_player_id?: string;
    casino_id: string;
    game_started_at: string;
    game_ended_at: string;
    isCancled: string;
    gameType: string;
}

export function getCurrentGameData(data: RoundDetailsResponse): GameData {
    const round_id = String(
        data.tptInfo?.at(0)?.round_id ?? ""
    ).trim();

    const game_id = String(
        data.tptInfo?.at(0)?.game_id ?? ""
    ).trim();

    const user_id = String(
        data.tptInfo?.at(0)?.user_id ?? ""
    ).trim();

    const casino_id = String(
        data.tptInfo?.at(0)?.casino_id ?? ""
    ).trim();

    const transDate = String(
        data.tptInfo?.at(0)?.trans_date ?? ""
    ).trim();

    const baseDate = new Date(transDate);

    const startDate = new Date(baseDate.getTime() - 5 * 60 * 1000);

    // 24 hours after startDate
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    const game_started_at = startDate.toString().trim();
    const game_ended_at = endDate.toString().trim();

    const isCancled = String(
        data.gameDetails?.at(0)?.cancelReason !== "" &&
        data.gameDetails?.at(0)?.cancelReason !== null
    ).trim();

    const gameType = String(getGameType(data.gameDetails?.at(0)?.game_type)).trim();

    return {
        round_id,
        game_id,
        user_id,
        casino_id,
        game_started_at,
        game_ended_at,
        isCancled,
        gameType
    };
}