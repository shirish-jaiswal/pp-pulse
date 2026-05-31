import { allPayoutByGameNameKeys } from "@/lib/excel-engine/excel-db-keys/potential-winning/all-payout-by-game-name";
import { getAllPayoutsByGameName } from "@/lib/excel-engine/potential-win/get-all-payout-by-game-name";
import { useQuery } from "@tanstack/react-query";


export function useGetAllPayoutsByGameName(tableName: string) {
  return useQuery({

    queryKey: allPayoutByGameNameKeys.list(tableName),
    queryFn: async () => {
      const data = await getAllPayoutsByGameName(tableName);
      return data;
    },
    enabled: !!tableName,
  });
}