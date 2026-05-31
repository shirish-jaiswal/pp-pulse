import { useQuery } from "@tanstack/react-query";
import { potentialWinningKeys } from "@/lib/excel-engine/excel-db-keys/potential-winning/potential-winning";
import { getPotentialWinningPayoutsByGameName } from "@/lib/excel-engine/potential-win/get-payouts-by-game-name";

export function useGetPotentialWinningsPayoutByGameName(tableName: string, bet_codes: string[]) {
  return useQuery({
    queryKey: potentialWinningKeys.list(tableName, { bet_codes }),
    queryFn: async () => {
      const data = await getPotentialWinningPayoutsByGameName(tableName, { bet_codes });
      return data;
    },
    enabled: !!tableName && bet_codes.length > 0,
  });
}