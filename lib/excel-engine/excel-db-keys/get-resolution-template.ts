// Excel Engine - Resolution Template Query Keys

const resolutionTemplatesQueryKey = "resolution-templates" as const;

export const resolutionTemplatesKeys = {
  // The base key for EVERYTHING related to resolution templates
  all: [resolutionTemplatesQueryKey] as const,

  // All "list" type queries (good for broad invalidation)
  lists: () => [...resolutionTemplatesKeys.all, "list"] as const,

  // Specific list with filters (e.g., search, pagination)
  list: (filters?: Record<string, any>) => 
    [...resolutionTemplatesKeys.lists(), { filters }] as const,

  // All "detail" type queries
  details: () => [...resolutionTemplatesKeys.all, "detail"] as const,

  // A specific resolution template by ID
  detail: (id: number | string | null) => 
    [...resolutionTemplatesKeys.details(), id] as const,
};