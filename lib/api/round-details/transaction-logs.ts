import apiRequest from "@/lib/api/api-request";
import { getBroadCategory, getGameType } from "@/utils/get-game-type";

export type TransactionLogsProps = {
    roundId: string;
    timeStamp: string;
    game_id?: string;
    user_id?: string;
    game_type?: string;
    operator?: "sw" | "bt" | "internal" | string;
};

export async function c_getTransactionLogs(
    rawData: TransactionLogsProps
): Promise<any> {
    try {
        const data = rawData;
        const isBtOperator = data.operator === "bt";

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
            
            // Transaction logs window: -15 mins to +24 hours
            const txnFrom = new Date(anchorTime.getTime() - 15 * 60 * 1000).toISOString();
            const txnTo = new Date(anchorTime.getTime() + 24 * 60 * 60 * 1000).toISOString();
            txnQueryParams.from = txnFrom;
            txnQueryParams.to = txnTo;

            // Game logs window: -5 mins to +15 mins
            const gameLogFrom = new Date(anchorTime.getTime() - 5 * 60 * 1000).toISOString();
            const gameLogTo = new Date(anchorTime.getTime() + 15 * 60 * 1000).toISOString();
            gameLogQueryParams.from = gameLogFrom;
            gameLogQueryParams.to = gameLogTo;
        }

        // Define the concurrent promises dynamically
        const transactionLogsPromise = isBtOperator
            ? Promise.resolve({ lcTransactionLogs: [], platformLogs: [] }) 
            : apiRequest({
                method: "GET",
                endpoint: "playerbetlogs/transactionlogs",
                params: txnQueryParams,
                requireCookie: true,
              });

        const gameLogsPromise = apiRequest({
            method: "GET",
            endpoint: "playerbetlogs/gamelogs",
            params: gameLogQueryParams,
            requireCookie: true,
        });

        const [transactionLogs, gameLogs] = await Promise.all([
            transactionLogsPromise,
            gameLogsPromise,
        ]);

        return {
            lcTransactionLogs: transactionLogs.lcTransactionLogs ?? [],
            platformLogs: transactionLogs.platformLogs ?? [],
            gameLogs: gameLogs.gameLogs ?? [],
        };
    } catch (error) {
        return {
            lcTransactionLogs: [],
            platformLogs: [],
            gameLogs: [],
        };
    }
}