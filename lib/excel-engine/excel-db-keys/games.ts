// Excel Engine - Resolution Template Query Keys

const gamesQueryKey: string = "games";

export const gamesKeys = {
    all: [gamesQueryKey] as const,

    lists: () => [...gamesKeys.all, "list"] as const,

    list: () =>
        [...gamesKeys.lists()] as const,
};