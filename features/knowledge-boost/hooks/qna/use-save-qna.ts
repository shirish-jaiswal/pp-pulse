import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";
import { saveQna } from "@/lib/excel-engine/knowledge-base/qna/save";
import { qnaKeys } from "@/lib/excel-engine/excel-db-keys/get-qna";

interface SaveQna {
  data: Partial<QNA>;
  id?: number | null;
}

export function useSaveQna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, id }: SaveQna) => {
      const payload = {
        ...data,
      } as QNA;

      return saveQna(payload, id ?? null);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: qnaKeys.list(),
      });

      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: qnaKeys.detail(variables.id),
        });
      }

      toast.success(variables.id ? "QNA updated" : "QNA created");
    },

    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error(`[SaveQNA Error]: ${errorMessage}`);
      toast.error("Failed to save QNA.");
    },
  });
}