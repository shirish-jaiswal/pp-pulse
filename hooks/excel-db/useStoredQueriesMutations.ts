import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storedQueryKeys } from "@/lib/excel-engine/excel-db-keys/kibana/queries-template";
import { STORED_QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/stored-queries/get-all";
import { createQueryTemplate } from "@/lib/excel-engine/kibana/stored-queries/save";
import { updateQueryTemplate } from "@/lib/excel-engine/kibana/stored-queries/update";
import { deleteQueryTemplate } from "@/lib/excel-engine/kibana/stored-queries/delete";

/**
 * Hook to handle all create, update, and delete mutations for Stored Queries.
 */
export function useStoredQueriesMutations() {
  const queryClient = useQueryClient();

  // Helper to invalidate all related query lists to force UI re-fetching
  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: storedQueryKeys.lists() });
  };

  // 1. SAVE / CREATE MUTATION
  const createMutation = useMutation({
    mutationFn: async (newTemplate: Omit<STORED_QUERIES_TEMPLATE_TYPE, "id">) => {
      const response = await createQueryTemplate(newTemplate);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      invalidateLists();
    },
  });

  // 2. UPDATE MUTATION
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<STORED_QUERIES_TEMPLATE_TYPE, "id">> }) => {
      const response = await updateQueryTemplate(id, updates);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      invalidateLists();
    },
  });

  // 3. DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteQueryTemplate(id);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      invalidateLists();
    },
  });

  return {
    saveTemplate: createMutation.mutateAsync,
    isSaving: createMutation.isPending,
    
    updateTemplate: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    
    deleteTemplate: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}