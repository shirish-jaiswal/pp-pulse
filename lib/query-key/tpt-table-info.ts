const tptTableQueryKey = "tpt-table" as const;

// Query Key Factory for TPT Table Info
export const tptTableKeys = {
  all: [tptTableQueryKey] as const,

  lists: () => [...tptTableKeys.all, "list"] as const,

  // Accepts dynamic query filters (roundId, gameId, userId)
  list: (filters?: Record<string, any>) =>
    [...tptTableKeys.lists(), { filters }] as const,

  details: () => [...tptTableKeys.all, "detail"] as const,

  detail: (idOrUuid: number | string | null) =>
    [...tptTableKeys.details(), idOrUuid] as const,
};