const profileQueryKey = "profile" as const;

export const profileKeys = {
  all: [profileQueryKey] as const,

  lists: () => [...profileKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...profileKeys.lists(), { filters }] as const,

  find: (query?: Record<string, any>) =>
    [...profileKeys.all, "find", { query }] as const,

  details: () => [...profileKeys.all, "detail"] as const,

  detail: (id: number | string | null) =>
    [...profileKeys.details(), id] as const,
};