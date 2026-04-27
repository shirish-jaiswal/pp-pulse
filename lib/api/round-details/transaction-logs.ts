import apiRequest from "@/lib/api/api-request";

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
        const queryParams: Record<string, any> = {};

        if (data.roundId) {
            queryParams.roundId = data.roundId;
        }

        if (data.timeStamp) {
            const anchorTime = new Date(data.timeStamp || new Date());
            const from = new Date(anchorTime.getTime() - 15 * 60 * 1000).toISOString();
            const to = new Date(anchorTime.getTime() + 24 * 60 * 60 * 1000).toISOString();
            queryParams.from = from;
            queryParams.to = to;
        }

        const [transactionLogs, gameLogs] = await Promise.all([
            apiRequest({
                method: "GET",
                endpoint: "playerbetlogs/transactionlogs",
                params: queryParams,
                requireCookie: true,
            }),
            apiRequest({
                method: "GET",
                endpoint: "playerbetlogs/gamelogs",
                params: queryParams,
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