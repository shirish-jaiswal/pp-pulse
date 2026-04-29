import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { featureListKeys } from "@/lib/excel-engine/excel-db-keys/rbac/feature-list";
import { deleteFeatureList } from "@/lib/excel-engine/rbac/feature-list/delete";

export function useDeleteFeatureList() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deleteFeatureList,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: featureListKeys.list(),
      });

      queryClient.removeQueries({
        queryKey: featureListKeys.detail(id),
      });

      toast.success("Feature deleted");
    },

    onError: (error) => {
      console.error("[DeleteFeatureList Error]:", error.message);
      toast.error("Failed to delete feature.");
    },
  });
}