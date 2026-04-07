import { useQuery } from "@tanstack/react-query";
import { getResolutionsAction, ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get";
import { resolutionTemplatesKeys } from "@/lib/excel-engine/excel-db-keys/get-resolution-template";

export function useResolutionTemplates() {
    return useQuery<ResolutionTemplate[], Error>({
        queryKey: resolutionTemplatesKeys.list(),
        queryFn: () => getResolutionsAction(),
        placeholderData: (previousData) => previousData
    });
}