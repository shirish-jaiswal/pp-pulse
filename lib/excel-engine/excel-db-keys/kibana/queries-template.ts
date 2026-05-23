const queriesTemplateQueryKey = "queries-template" as const;

// Query Key Factory
export const queriesTemplateKeys = {
  all: [queriesTemplateQueryKey] as const,

  lists: () => [...queriesTemplateKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...queriesTemplateKeys.lists(), { filters }] as const,

  details: () => [...queriesTemplateKeys.all, "detail"] as const,

  detail: (id: number | null) =>
    [...queriesTemplateKeys.details(), id] as const,
};