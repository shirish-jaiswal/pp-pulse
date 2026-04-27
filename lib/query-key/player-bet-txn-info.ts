const playerBetTxnInfoQueryKey: string = "player_bet_txn_info";

export const playerBetTxnInfoKeys = {
    all: [playerBetTxnInfoQueryKey] as const,

    lists: () => [...playerBetTxnInfoKeys.all, "list"] as const,

    list: (typeParam: string, gameParamId: string, user_id : string, playerParamId : string) =>
        [...playerBetTxnInfoKeys.lists(), { typeParam, gameParamId, user_id, playerParamId }] as const,
};