const findCardsQueryKey = "find-selected-cards";

export const findCardsKeys = {
  all: [findCardsQueryKey] as const,

  lists: () => [...findCardsKeys.all, "list"] as const,

  list: (filters: { code: string[] }) =>
    [...findCardsKeys.lists(), filters] as const,
};