import { useQuery } from "@tanstack/react-query";

import { getAllSearchAutoCompelete, SEARCH_AUTO_COMPELETE_TYPE } from "@/lib/excel-engine/kibana/search-auto-compelete/get-all";
import { searchAutoCompleteKeys } from "@/lib/excel-engine/excel-db-keys/kibana/search-auto-compelete";

export function useSearchAutoComplete() {
  return useQuery<SEARCH_AUTO_COMPELETE_TYPE[], Error>({
    queryKey: searchAutoCompleteKeys.list(),
    queryFn: () => getAllSearchAutoCompelete(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 60 * 24,
  });
}