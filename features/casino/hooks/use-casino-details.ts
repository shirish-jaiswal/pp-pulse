import { useQuery } from "@tanstack/react-query";
import { CasinoDetails } from "@/features/casino/types/details";
import { CasinoDetailsFormType } from "@/features/casino/types/casino-details-input";
import { casinoConfigKeys } from "@/lib/query-key/casino-config";
import { c_getCasinoDetails } from "@/lib/server/casino/details";
import { CasinoConfig } from "@/features/casino/types/config";
import { OneWalletConfig } from "@/features/casino/types/one-wallet-config";
import { GameConfig } from "@/features/casino/types/game-config";

export function useCasinoDetails(params: CasinoDetailsFormType | null) {
  return useQuery<CasinoDetails | CasinoConfig | OneWalletConfig | GameConfig[], Error>({
    queryKey: params 
      ? casinoConfigKeys.list(params.casinoId, params.details)
      : casinoConfigKeys.all,

    queryFn: () => {
      if (!params) throw new Error("No parameters provided");
      return c_getCasinoDetails(params);
    },

    enabled: !!params?.casinoId,
    
    placeholderData: (previousData) => previousData,
  });
}