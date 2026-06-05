const crashAdditionalDetailsQueryKey: string = "crash-additional-details";

export const crashAdditionalDetailsKeys = {
    all: [crashAdditionalDetailsQueryKey] as const,

    lists: () => [...crashAdditionalDetailsKeys.all, "list"] as const,

    // Captures the unique query combinations for highflyer/spaceman additional details
    list: (params: { roundId: string; gameType?: string }) =>
        [...crashAdditionalDetailsKeys.lists(), params] as const,
};