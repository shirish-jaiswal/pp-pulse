import { useQuery } from "@tanstack/react-query";
import { DropdownOption } from "@/features/resolution-template/components/form/selector";
import { variablesKeys } from "@/lib/excel-engine/excel-db-keys/get-keys";
import { getAllVariables, VariableTypes } from "@/lib/excel-engine/variables/get";

export function useGetVariables()  {
    return useQuery({
        queryKey: variablesKeys.list(),
        queryFn: async () => {
            const data: VariableTypes[] = await getAllVariables();
            return data;
        },
    });
}