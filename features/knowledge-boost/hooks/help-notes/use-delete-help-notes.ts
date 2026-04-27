import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { helpNotesKeys } from "@/lib/excel-engine/excel-db-keys/help-notes";
import { deleteHelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/delete";

export function useDeleteHelpNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteHelpNotes(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: helpNotesKeys.list(),
      });
      toast.success("Help Note deleted successfully");
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error("Failed to delete the Help Note");
    },
  });
}