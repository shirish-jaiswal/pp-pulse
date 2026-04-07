import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResolutionAction } from "@/lib/excel-engine/resolution-template/delete";
import { resolutionTemplatesKeys } from "@/lib/excel-engine/excel-db-keys/get-resolution-template";
import { toast } from "sonner";

export function useDeleteResolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteResolutionAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: resolutionTemplatesKeys.list(),
      });
      toast.success("Template deleted successfully");
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error("Failed to delete the template");
    },
  });
}