const featureListQueryKey = "feature-list" as const;

export const featureListKeys = {
  all: [featureListQueryKey] as const,

  lists: () => [...featureListKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...featureListKeys.lists(), { filters }] as const,

  details: () => [...featureListKeys.all, "detail"] as const,

  detail: (id: number | string | null) =>
    [...featureListKeys.details(), id] as const,
};