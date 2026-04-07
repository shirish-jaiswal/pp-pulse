import { useQuery } from "@tanstack/react-query";
import { DropdownOption } from "@/features/resolution-template/components/form/selector";
import { GAMETYPE, getGamesAction } from "@/lib/excel-engine/game/get";
import { gamesKeys } from "@/lib/excel-engine/excel-db-keys/games";

export function useGames()  {
    return useQuery({
        queryKey: gamesKeys.list(),
        queryFn: async () => {
            const data: GAMETYPE[] = await getGamesAction();

            return data.map((item) => ({
                key: String(item.id),
                value: item.title,
            })) as DropdownOption[];
        },
    });
}