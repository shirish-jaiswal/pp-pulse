import { useQuery } from "@tanstack/react-query";
import { getAllProfile, Profile } from "@/lib/excel-engine/rbac/profile/get-all";
import { profileKeys } from "@/lib/excel-engine/excel-db-keys/rbac/profile";

export function useGetAllProfiles() {
    return useQuery<Profile[], Error>({
        queryKey: profileKeys.list(),
        queryFn: () => getAllProfile(),
        placeholderData: (previousData) => previousData
    });
}