import { profileKeys } from "@/lib/excel-engine/excel-db-keys/rbac/profile";
import { findProfile } from "@/lib/excel-engine/rbac/profile/find";
import { useQuery } from "@tanstack/react-query";


export type FindProfileFilters = {
  email: string;
  role?: string;
};

export function useFindProfile(filters: FindProfileFilters) {
  return useQuery({
    queryKey: profileKeys.find(filters),
    queryFn: () => findProfile(filters),
    enabled: !!filters?.email,
  });
}