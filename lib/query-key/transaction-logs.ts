const transactionLogsQueryKey: string = "transaction-logs";

export const transactionLogsKeys = {
    all: [transactionLogsQueryKey] as const,

    lists: () => [...transactionLogsKeys.all, "list"] as const,

    list: (casinoId: string, details: string) =>
        [...transactionLogsKeys.lists(), { casinoId, details}] as const,
};