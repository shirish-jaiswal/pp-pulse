const roleQueryKey = "role" as const;

export const roleKeys = {
  all: [roleQueryKey] as const,

  lists: () => [...roleKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...roleKeys.lists(), { filters }] as const,

  details: () => [...roleKeys.all, "detail"] as const,

  detail: (id: number | string | null) =>
    [...roleKeys.details(), id] as const,
};