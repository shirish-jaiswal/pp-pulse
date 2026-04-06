import { useQuery } from "@tanstack/react-query";
import { SUBCATEGORYTYPE, getSubcategoriesAction } from "@/lib/excel-engine/sub-category/get";
import { DropdownOption } from "@/features/resolution-template/components/form/selector";

export function useSubcategories() {
    return useQuery({
        queryKey: ["subcategories"],
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