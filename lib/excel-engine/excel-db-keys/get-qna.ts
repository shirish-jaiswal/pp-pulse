const qnaQueryKey = "qna" as const;

export const qnaKeys = {
  all: [qnaQueryKey] as const,

  lists: () => [...qnaKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...qnaKeys.lists(), { filters }] as const,

  details: () => [...qnaKeys.all, "detail"] as const,

  detail: (id: number | string | null) =>
    [...qnaKeys.details(), id] as const,
};