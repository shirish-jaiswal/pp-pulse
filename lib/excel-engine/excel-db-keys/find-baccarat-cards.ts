const findBaccaratCardsQueryKey = "find-baccarat-cards";

export const findBaccaratCardsKeys = {
  all: [findBaccaratCardsQueryKey] as const,

  lists: () => [...findBaccaratCardsKeys.all, "list"] as const,

  list: (filters: { code: string[] }) =>
    [...findBaccaratCardsKeys.lists(), filters] as const,
};