import { payoutGameListKeys } from "@/lib/excel-engine/excel-db-keys/potential-winning/payout-games-list";
import { getAllGameTableNames } from "@/lib/excel-engine/potential-win/get-all-payout-game-list";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all available sheet names (games) present in the Excel database
 */
export function useGetPayoutGameList() {
  return useQuery({
    // 1. Uses the dedicated tracking key for metadata / sheets list
    queryKey: payoutGameListKeys.sheets(),
    
    // 2. Invokes the server action to get the array of table strings
    queryFn: async () => {
      const data = await getAllGameTableNames();
      return data;
    },

    // 3. Performance tweak: Since table schemas change rarely, 
    // keep this data fresh longer to minimize redundant file reads.
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}