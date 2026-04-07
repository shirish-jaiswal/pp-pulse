import { useQuery } from "@tanstack/react-query";
import { SUBCATEGORYTYPE, getSubcategoriesAction } from "@/lib/excel-engine/sub-category/get";
import { DropdownOption } from "@/features/resolution-template/components/form/selector";
import { subCategoriesKeys } from "@/lib/excel-engine/excel-db-keys/sub-categories";

export function useSubcategories() {
    return useQuery({
        queryKey: subCategoriesKeys.list(),
        queryFn: async () => {
            const data: SUBCATEGORYTYPE[] =
                await getSubcategoriesAction();

            return data.map((item) => ({
                key: String(item.id),
                value: item.title,
            })) as DropdownOption[];
        },
    });
}