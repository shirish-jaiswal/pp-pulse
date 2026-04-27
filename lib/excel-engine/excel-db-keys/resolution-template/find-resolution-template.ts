const findResolutionTemplatesQueryKey = "find-resolution-templates";

export const findResolutionTemplatesKeys = {
  all: [findResolutionTemplatesQueryKey] as const,

  lists: () => [...findResolutionTemplatesKeys.all, "list"] as const,

  list: (filters: { game: string; category: string }) =>
    [...findResolutionTemplatesKeys.lists(), filters] as const,
};