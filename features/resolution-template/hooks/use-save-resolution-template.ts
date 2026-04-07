import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolutionTemplatesKeys } from "@/lib/excel-engine/excel-db-keys/get-resolution-template";
import { saveResolutionAction } from "@/lib/excel-engine/resolution-template/save";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get";

interface SaveResolutionVariables {
  data: Partial<ResolutionTemplate>;
  id: number | null;
}

export function useSaveResolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, id }: SaveResolutionVariables) => {
      const payload = {
        game: data.game ?? "",
        category: data.category ?? "",
        content: data.content ?? "",
        ...data,
      } as ResolutionTemplate;

      return saveResolutionAction(payload, id);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: resolutionTemplatesKeys.list(),
      });

      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: resolutionTemplatesKeys.detail(variables.id),
        });
      }

      toast.success(variables.id ? "Resolution updated" : "Resolution created");
    },

    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`[SaveResolution Error]: ${errorMessage}`);
      toast.error("Failed to save resolution.");
    },
  });
}