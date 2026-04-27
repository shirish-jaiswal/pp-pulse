// Excel Engine - Resolution Template Query Keys

const helpNotesQueryKey = "help-notes" as const;

export const helpNotesKeys = {
  // The base key for EVERYTHING related to resolution templates
  all: [helpNotesQueryKey] as const,

  // All "list" type queries (good for broad invalidation)
  lists: () => [...helpNotesKeys.all, "list"] as const,

  // Specific list with filters (e.g., search, pagination)
  list: (filters?: Record<string, any>) =>
    [...helpNotesKeys.lists(), { filters }] as const,

  // All "detail" type queries
  details: () => [...helpNotesKeys.all, "detail"] as const,

  // A specific resolution template by ID
  detail: (id: number | string | null) =>
    [...helpNotesKeys.details(), id] as const,
};