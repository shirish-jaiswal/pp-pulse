import { useQuery } from "@tanstack/react-query";
import { CATEGORYTYPE, getCategories } from "@/lib/excel-engine/category/get";
import { categoriesKeys } from "@/lib/excel-engine/excel-db-keys/categories";

export function useCategories() {
    return useQuery<CATEGORYTYPE[], Error>({
        queryKey: categoriesKeys.list(),
        queryFn: () => getCategories(),
        placeholderData: (previousData) => previousData
    });
}