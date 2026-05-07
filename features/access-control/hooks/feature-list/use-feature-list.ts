import { useQuery } from "@tanstack/react-query";
import { FeatureListTemplate, getAllFeatureList } from "@/lib/excel-engine/rbac/feature-list/get-all";
import { featureListKeys } from "@/lib/excel-engine/excel-db-keys/rbac/feature-list";

export function useGetAllFeatureList() {
    return useQuery<FeatureListTemplate[], Error>({
        queryKey: featureListKeys.list(),
        queryFn: () => getAllFeatureList(),
        placeholderData: (previousData) => previousData
    });
}