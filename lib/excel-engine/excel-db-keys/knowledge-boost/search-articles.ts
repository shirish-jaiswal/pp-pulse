const searchArticlesQueryKey = "search-articles" as const;

export const searchArticlesKeys = {
  all: [searchArticlesQueryKey] as const,

  lists: () => [...searchArticlesKeys.all, "list"] as const,

  list: (keywords?: string[], columns?: string[]) =>
    [...searchArticlesKeys.lists(), { keywords, columns }] as const,

  details: () => [...searchArticlesKeys.all, "detail"] as const,

  detail: (id: number | string | null) =>
    [...searchArticlesKeys.details(), id] as const,
};