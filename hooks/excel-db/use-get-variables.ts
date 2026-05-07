import { useQuery } from "@tanstack/react-query";
import { DropdownOption } from "@/features/resolution-template/components/form/selector";
import { variablesKeys } from "@/lib/excel-engine/excel-db-keys/resolution-template/get-variable-keys";
import { getAllVariables, VariableTypes } from "@/lib/excel-engine/resolution-template/variables/get";

export function useGetVariables()  {
    return useQuery({
        queryKey: variablesKeys.list(),
        queryFn: async () => {
            const data: VariableTypes[] = await getAllVariables();
            return data;
        },
    });
}