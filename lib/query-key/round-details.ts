const roundDetailsQueryKey: string = "round-details";

export const roundDetailsKeys = {
    all: [roundDetailsQueryKey] as const,

    lists: () => [...roundDetailsKeys.all, "list"] as const,

    list: (roundId: string, gameId: string, userId: string) =>
        [...roundDetailsKeys.lists(), { roundId, gameId, userId }] as const,
};