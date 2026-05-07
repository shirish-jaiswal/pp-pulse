import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeatureListTemplate } from "@/lib/excel-engine/rbac/feature-list/get-all";
import { featureListKeys } from "@/lib/excel-engine/excel-db-keys/rbac/feature-list";
import { saveFeatureList } from "@/lib/excel-engine/rbac/feature-list/save";

interface SaveFeatureList {
  data: Partial<FeatureListTemplate>;
  id?: number | null;
}

export function useSaveFeatureList() {
  const queryClient = useQueryClient();

  return useMutation<FeatureListTemplate, Error, SaveFeatureList>({
    mutationFn: async ({ data, id }) => {
      const payload = {
        ...data,
      } as FeatureListTemplate;

      return saveFeatureList(payload, id ?? null);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: featureListKeys.list(),
      });

      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: featureListKeys.detail(variables.id),
        });
      }

      toast.success(
        variables.id ? "Feature updated" : "Feature created"
      );
    },

    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error(`[SaveFeatureList Error]: ${errorMessage}`);
      toast.error("Failed to save feature.");
    },
  });
}