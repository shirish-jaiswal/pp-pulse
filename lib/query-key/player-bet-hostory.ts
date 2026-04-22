export const playerBetHistoryQueryKey: string = "player_bet_history";

export const playerBetHistoryKeys = {
    all: [playerBetHistoryQueryKey] as const,

    lists: () => [...playerBetHistoryKeys.all, "list"] as const,

    list: (playerId: string, from: string, to: string) =>
        [...playerBetHistoryKeys.lists(), { playerId, from, to }] as const,
};