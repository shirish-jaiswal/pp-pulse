import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";
import { saveQna } from "@/lib/excel-engine/knowledge-base/qna/save";
import { qnaKeys } from "@/lib/excel-engine/excel-db-keys/get-qna";
import { HelpNote } from "./use-help-notes";
import { saveHelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/save";

interface SaveHelpNotes {
  data: Partial<HelpNote>;
  id?: number | null;
}

export function useSaveHelpNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, id }: SaveHelpNotes) => {
      const payload = {
        ...data,
      } as QNA;

      return saveHelpNotes(payload, id);
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

      toast.success(variables.id ? "Help Notes updated" : "Help Notes created");
    },

    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`[SaveQNA Error]: ${errorMessage}`);
      toast.error("Failed to save Help Notes.");
    },
  });
}