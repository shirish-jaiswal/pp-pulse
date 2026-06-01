// @/lib/api/round-details/transaction-logs.ts

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

function buildLogQueryWindows(data: TransactionLogsProps) {
    const txnQueryParams: Record<string, any> = {};
    const gameLogQueryParams: Record<string, any> = {};

    if (data.roundId) txnQueryParams.roundId = data.roundId;
    
    if (data.game_id && data.user_id && data.game_type) {
        gameLogQueryParams.gameId = data.game_id;
        gameLogQueryParams.userId = data.user_id;
        gameLogQueryParams.gameType = getBroadCategory(getGameType(data.game_type));
    }

    if (data.timeStamp) {
        const anchorTime = new Date(data.timeStamp);
        txnQueryParams.from = new Date(anchorTime.getTime() - 15 * 60 * 1000).toISOString();
        txnQueryParams.to = new Date(anchorTime.getTime() + 24 * 60 * 60 * 1000).toISOString();

        gameLogQueryParams.from = new Date(anchorTime.getTime() - 5 * 60 * 1000).toISOString();
        gameLogQueryParams.to = new Date(anchorTime.getTime() + 15 * 60 * 1000).toISOString();
    }

    return { txnQueryParams, gameLogQueryParams };
}

/**
 * Fetches platformLogs and lcTransactionLogs safely
 */
export async function fetchTransactionLogs(data: TransactionLogsProps) {
    if (data.operator === "bt") {
        return { lcTransactionLogs: [], platformLogs: [], isTxnError: false };
    }
    
    const { txnQueryParams } = buildLogQueryWindows(data);
    
    return apiRequest({
        method: "GET",
        endpoint: "playerbetlogs/transactionlogs",
        params: txnQueryParams,
        requireCookie: true,
    }).catch((err) => {
        // ✅ Prevent unhandled server rejections from breaking dehydration
        console.error("Transaction/Platform logs backend failure:", err);
        return { lcTransactionLogs: [], platformLogs: [], isTxnError: true };
    });
}

/**
 * Fetches gameLogs safely, absorbing 500 server errors
 */
export async function fetchGameLogs(data: TransactionLogsProps) {
    const { gameLogQueryParams } = buildLogQueryWindows(data);
    
    return apiRequest({
        method: "GET",
        endpoint: "playerbetlogs/gamelogs",
        params: gameLogQueryParams,
        requireCookie: true,
    }).catch((err) => {
        // ✅ Absorbs 500 errors gracefully so game-logs fail independently
        console.error("Game logs backend failure:", err);
        return { gameLogs: [], isGameError: true };
    });
}