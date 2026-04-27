const helpNotesQueryKey = "help-notes" as const;

export const helpNotesKeys = {
  all: [helpNotesQueryKey] as const,

  lists: () => [...helpNotesKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...helpNotesKeys.lists(), { filters }] as const,

  details: () => [...helpNotesKeys.all, "detail"] as const,

  detail: (id: number | string | null) =>
    [...helpNotesKeys.details(), id] as const,
};