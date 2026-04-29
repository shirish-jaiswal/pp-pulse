import apiRequest from "@/lib/api/api-request";
import { getBroadCategory, getGameType } from "@/utils/get-game-type";

export type TransactionLogsProps = {
    roundId: string;
    timeStamp: string;
    game_id?: string;
    user_id?: string;
    game_type?: string;
};

export async function c_getTransactionLogs(
    rawData: TransactionLogsProps
): Promise<any> {
    try {
        const data = rawData;
        const txnQueryParams: Record<string, any> = {};
        const gameLogQueryParams: Record<string, any> = {};

        if (data.roundId) txnQueryParams.roundId = data.roundId;
        if (data.game_id && data.user_id && data.game_type) {
            gameLogQueryParams.gameId = data.game_id;
            gameLogQueryParams.userId = data.user_id;
            const gameType = getBroadCategory(getGameType(data.game_type));
            gameLogQueryParams.gameType = gameType;
        }

        if (data.timeStamp) {
            const anchorTime = new Date(data.timeStamp || new Date());
            const from = new Date(anchorTime.getTime() - 15 * 60 * 1000).toISOString();
            const to = new Date(anchorTime.getTime() + 24 * 60 * 60 * 1000).toISOString();
            txnQueryParams.from = from;
            gameLogQueryParams.from = from;
            txnQueryParams.to = to;
            gameLogQueryParams.to = to;
        }

        if (data.timeStamp) {
            const anchorTime = new Date(data.timeStamp || new Date());
            const from = new Date(anchorTime.getTime() - 10 * 60 * 1000).toISOString();
            const to = new Date(anchorTime.getTime() + 15 * 60 * 1000).toISOString();
            gameLogQueryParams.from = from;
            gameLogQueryParams.to = to;
        }

        const [transactionLogs, gameLogs] = await Promise.all([
            apiRequest({
                method: "GET",
                endpoint: "playerbetlogs/transactionlogs",
                params: txnQueryParams,
                requireCookie: true,
            }),
            apiRequest({
                method: "GET",
                endpoint: "playerbetlogs/gamelogs",
                params: gameLogQueryParams,
                requireCookie: true,
            }),
        ]);

        return {
            lcTransactionLogs: transactionLogs.lcTransactionLogs ?? [],
            platformLogs: transactionLogs.platformLogs ?? [],
            gameLogs: gameLogs.gameLogs ?? [],
        };
    } catch (error) {
        return {
            transactionLogs: [],
            gameLogs: [],
        };
    }
}