import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQna } from "@/lib/excel-engine/knowledge-base/qna/delete";
import { qnaKeys } from "@/lib/excel-engine/excel-db-keys/get-qna";
import { toast } from "sonner";

export function useDeleteQna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteQna(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: qnaKeys.list(),
      });
      toast.success("QNA deleted successfully");
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error("Failed to delete the QNA");
    },
  });
}