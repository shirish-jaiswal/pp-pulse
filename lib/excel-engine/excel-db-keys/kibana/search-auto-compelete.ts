const searchAutoCompleteQueryKey = "search-auto-complete" as const;

// Query Key Factory
export const searchAutoCompleteKeys = {
  all: [searchAutoCompleteQueryKey] as const,

  lists: () => [...searchAutoCompleteKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...searchAutoCompleteKeys.lists(), { filters }] as const,

  details: () => [...searchAutoCompleteKeys.all, "detail"] as const,

  detail: (id: number | string | null) =>
    [...searchAutoCompleteKeys.details(), id] as const,
};