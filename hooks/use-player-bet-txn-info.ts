import { useQuery } from "@tanstack/react-query";
import { playerBetTxnInfoKeys } from "@/lib/query-key/player-bet-txn-info";
import { c_getPlayerBetTxnInfo } from "@/lib/server/round-details";
import { PlayerBetTxnInfoProps } from "@/types/round-details-input";
import { PlayerBetTxnResponse } from "@/types/round-details";

export function usePlayerBetTxnInfo(params: PlayerBetTxnInfoProps) {
    return useQuery<PlayerBetTxnResponse, Error>({
        queryKey: playerBetTxnInfoKeys.list(
            params.game_id, 
            params.gameParamId, 
            params.user_id, 
            params.playerParamId
        ),
        queryFn: () => c_getPlayerBetTxnInfo(params),
        enabled: !!params.game_id,
        placeholderData: (previousData) => previousData
    });
}