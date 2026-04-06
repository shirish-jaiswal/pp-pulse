import { useQuery } from "@tanstack/react-query";
import { DropdownOption } from "../components/form/selector";
import { GAMETYPE, getGamesAction } from "@/lib/excel-engine/game/get";

export function useGames()  {
    return useQuery({
        queryKey: ["games"],
        queryFn: async () => {
            const data: GAMETYPE[] = await getGamesAction();

            return data.map((item) => ({
                key: String(item.id),
                value: item.title,
            })) as DropdownOption[];
        },
    });
}