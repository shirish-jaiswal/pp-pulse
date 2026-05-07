import { useQuery } from "@tanstack/react-query";
import { getAllRoles, Roles } from "@/lib/excel-engine/rbac/roles/get-all";
import { roleKeys } from "@/lib/excel-engine/excel-db-keys/rbac/role";

export function useGetAllRoles() {
    return useQuery<Roles[], Error>({
        queryKey: roleKeys.list(),
        queryFn: () => getAllRoles(),
        placeholderData: (previousData) => previousData
    });
}