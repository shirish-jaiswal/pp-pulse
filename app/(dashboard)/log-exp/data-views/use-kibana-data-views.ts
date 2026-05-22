import { useQuery } from "@tanstack/react-query";
import { kibanaDataViewsKeys } from "@/lib/excel-engine/excel-db-keys/kibana/data-views";
import { DATA_VIEWS_TYPE, getAllDataViews } from "@/lib/excel-engine/kibana/data-views/get-all";

export function useDataViews() {
    return useQuery<DATA_VIEWS_TYPE[], Error>({
        queryKey: kibanaDataViewsKeys.list(),
        queryFn: () => getAllDataViews(),
        placeholderData: (previousData) => previousData,
        staleTime: 10000 * 60 * 60 * 24
    });
}