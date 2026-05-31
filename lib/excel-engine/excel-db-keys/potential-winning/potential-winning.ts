const potentialWinningQueryKey = "potential-winning" as const;

export const potentialWinningKeys = {
  all: [potentialWinningQueryKey] as const,

  lists: () => [...potentialWinningKeys.all, "list"] as const,

  // Updated to accept tableName and filters explicitly
  list: (tableName: string, filters?: Record<string, any>) =>
    [...potentialWinningKeys.lists(), tableName, { filters }] as const,

  details: () => [...potentialWinningKeys.all, "detail"] as const,
  detail: (id: number | string | null) =>
    [...potentialWinningKeys.details(), id] as const,
};