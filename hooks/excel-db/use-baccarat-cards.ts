import { useQuery } from "@tanstack/react-query";
import { findBaccaratCards } from "@/lib/excel-engine/game/baccarat-cards/find";
import { findCardsKeys } from "@/lib/excel-engine/excel-db-keys/find-cards";

interface Cards {
    code: string;
    rank: string;
    suit: string;
}

export function useFindCards(filters: {
  code : string[]
}) {
    return useQuery<Cards[], Error>({
        queryKey: findCardsKeys.list(filters),
        queryFn: () => findBaccaratCards(filters),
        placeholderData: (previousData) => previousData,
        staleTime: 10000*60*60,
    });
}