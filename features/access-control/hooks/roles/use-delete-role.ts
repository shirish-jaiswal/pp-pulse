import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleKeys } from "@/lib/excel-engine/excel-db-keys/rbac/role";
import { deleteRole } from "@/lib/excel-engine/rbac/roles/delete";

export function useDeleteRole() {
    const queryClient = useQueryClient();

    return useMutation<{ success: boolean }, Error, number>({
        mutationFn: deleteRole,

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: roleKeys.list(),
            });

            queryClient.removeQueries({
                queryKey: roleKeys.detail(id),
            });

            toast.success("Role deleted");
        },

        onError: (error) => {
            console.error("[DeleteRole Error]:", error.message);
            toast.error("Failed to delete role.");
        },
    });

}