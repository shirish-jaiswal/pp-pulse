const payoutGameListQueryKey = "payout-game-list" as const;

export const payoutGameListKeys = {
  all: [payoutGameListQueryKey] as const,

  lists: () => [...payoutGameListKeys.all, "list"] as const,
  list: (tableName: string, filters?: Record<string, any>) =>
    [...payoutGameListKeys.lists(), tableName, { filters }] as const,

  // Added key for fetching all sheets collectively
  sheets: () => [...payoutGameListKeys.all, "sheets"] as const,

  details: () => [...payoutGameListKeys.all, "detail"] as const,
  detail: (id: number | string | null) =>
    [...payoutGameListKeys.details(), id] as const,
};