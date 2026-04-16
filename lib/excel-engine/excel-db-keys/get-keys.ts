// Excel Engine - Resolution Template Query Keys

const variablesQueryKey: string = "games";

export const variablesKeys = {
    all: [variablesQueryKey] as const,

    lists: () => [...variablesKeys.all, "list"] as const,

    list: () =>
        [...variablesKeys.lists()] as const,
};