const transactionLogsQueryKey = "logs" as const;

export const transactionLogsKeys = {
  all: [transactionLogsQueryKey] as const,

  lists: () => [...transactionLogsKeys.all, "list"] as const,

  list: (filters?: {
    roundId?: string;
    timeStamp?: string;
    game_id?: string;
    user_id?: string;
    game_type?: string;
    operator?: string;
  }) => [...transactionLogsKeys.lists(), { filters }] as const,

  details: () => [...transactionLogsKeys.all, "detail"] as const,

  detail: (logId: string | number | null) => 
    [...transactionLogsKeys.details(), logId] as const,
};