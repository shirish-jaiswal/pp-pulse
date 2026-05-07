const casinoConfigQueryKey: string = "casino-config";

export const casinoConfigKeys = {
    all: [casinoConfigQueryKey] as const,

    lists: () => [...casinoConfigKeys.all, "list"] as const,

    list: (casinoId: string, details: string) =>
        [...casinoConfigKeys.lists(), { casinoId, details}] as const,
};