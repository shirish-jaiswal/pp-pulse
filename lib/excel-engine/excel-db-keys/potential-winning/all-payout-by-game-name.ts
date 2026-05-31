const allPayoutByGameNameQueryKey = "all-payout-by-game-name" as const;

export const allPayoutByGameNameKeys = {
  all: [allPayoutByGameNameQueryKey] as const,

  lists: () => [...allPayoutByGameNameKeys.all, "list"] as const,
  list: (gameName: string,) =>
    [...allPayoutByGameNameKeys.lists(), gameName] as const,

  sheets: () => [...allPayoutByGameNameKeys.all, "sheets"] as const,

  details: () => [...allPayoutByGameNameKeys.all, "detail"] as const,
  detail: (id: number | string | null) =>
    [...allPayoutByGameNameKeys.details(), id] as const,
};