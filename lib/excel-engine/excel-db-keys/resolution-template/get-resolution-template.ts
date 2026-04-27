const resolutionTemplatesQueryKey = "resolution-templates" as const;

export const resolutionTemplatesKeys = {
  all: [resolutionTemplatesQueryKey] as const,

  lists: () => [...resolutionTemplatesKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...resolutionTemplatesKeys.lists(), { filters }] as const,

  details: () => [...resolutionTemplatesKeys.all, "detail"] as const,

  detail: (id: number | string | null) =>
    [...resolutionTemplatesKeys.details(), id] as const,
};