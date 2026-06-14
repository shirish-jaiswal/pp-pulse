const storedQueryKey = "stored-query" as const;

// Query Key Factory
export const storedQueryKeys = {
  all: [storedQueryKey] as const,

  lists: () => [...storedQueryKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...storedQueryKeys.lists(), { filters }] as const, // Added missing [ ]

  details: () => [...storedQueryKeys.all, "detail"] as const,

  detail: (id: number | null) =>
    [...storedQueryKeys.details(), id] as const, // Added missing [ ]
};