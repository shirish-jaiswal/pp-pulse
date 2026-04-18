import { useQuery } from "@tanstack/react-query";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get-all";
import { findResolutionTemplatesKeys } from "@/lib/excel-engine/excel-db-keys/find-resolution-template";
import { findResolutionTemplatesAction } from "@/lib/excel-engine/resolution-template/find";

export function useFindResolutionTemplates(filters: {
  game: string;
  category: string;
}) {
    return useQuery<ResolutionTemplate[], Error>({
        queryKey: findResolutionTemplatesKeys.list(filters),
        queryFn: () => findResolutionTemplatesAction(filters),
        placeholderData: (previousData) => previousData
    });
}