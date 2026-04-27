import { useQuery } from "@tanstack/react-query";
import { findBaccaratCards } from "@/lib/excel-engine/game/baccarat-cards/find";
import { findBaccaratCardsKeys } from "@/lib/excel-engine/excel-db-keys/find-baccarat-cards";

interface Cards {
    code: string;
    rank: string;
    suit: string;
}

export function useFindBaccaratCards(filters: {
  code : string[]
}) {
    return useQuery<Cards[], Error>({
        queryKey: findBaccaratCardsKeys.list(filters),
        queryFn: () => findBaccaratCards(filters),
        placeholderData: (previousData) => previousData
    });
}