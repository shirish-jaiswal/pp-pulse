import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Roles } from "@/lib/excel-engine/rbac/roles/get-all";
import { roleKeys } from "@/lib/excel-engine/excel-db-keys/rbac/role";
import { saveRole } from "@/lib/excel-engine/rbac/roles/save";

interface SaveRole {
  data: Partial<Roles>;
  id?: number | null;
}

export function useSaveRole() {
  const queryClient = useQueryClient();

  return useMutation<Roles, Error, SaveRole>({
    mutationFn: async ({ data, id }) => {
      const payload = {
        ...data,
      } as Roles;

      return saveRole(payload, id ?? null);
    },

    onSuccess: (_, variables) => {
      // refresh list
      queryClient.invalidateQueries({
        queryKey: roleKeys.list(),
      });

      // refresh detail if editing
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: roleKeys.detail(variables.id),
        });
      }

      toast.success(variables.id ? "Role updated" : "Role created");
    },

    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error(`[SaveRole Error]: ${errorMessage}`);
      toast.error("Failed to save role.");
    },
  });
}