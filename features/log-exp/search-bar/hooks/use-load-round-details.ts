import { useCallback, useMemo, useRef } from "react";
import useGetRoundDetails from "@/features/round-details/hook/use-get-round-details";
import { extractIdentifiersFromLookupToken } from "../utils/extract-identifiers-from-look-up-token";

interface UseSmartSearchApiProps {
    value: string; // This is the global debounced value
}

export const useLoadRoundDetails = ({ value }: UseSmartSearchApiProps) => {
    const lastFetchedRef = useRef("");

    // 1. Create a unified extractor helper used everywhere
    const parseTokenIdentifiers = useCallback((tokenStr: string) => {
        const tokenMatch = tokenStr.match(/@[^\s"']+/);
        const isolatedToken = tokenMatch ? tokenMatch[0] : "";

        const parsed = extractIdentifiersFromLookupToken(isolatedToken);
        const roundId = parsed?.roundId || "";
        const gameId = parsed?.gameId === "game" ? "" : (parsed?.gameId || "");
        const userId = parsed?.userId === "user" ? "" : (parsed?.userId || "");

        const hasToken = !!isolatedToken && !!(roundId || gameId || userId);
        const key = `${roundId}-${gameId}-${userId}`;

        return { roundId, gameId, userId, hasToken, key };
    }, []);

    // 2. Compute live values based directly on the current value state context
    const currentIdentifiers = useMemo(() => {
        return extractIdentifiersFromLookupToken(value);
    }, [value, parseTokenIdentifiers]);

    // 3. Connect the parsed identifiers right into your custom data fetcher hook scope
    const {
        data: roundDetails,
        isLoading: isRoundDetailsLoading,
        refetch,
    } = useGetRoundDetails({
        round_id: currentIdentifiers.roundId,
        game_id: currentIdentifiers.gameId,
        user_id: currentIdentifiers.userId,
        enabled: false,
    });

    // 4. Update your trigger handler to let the user fire requests dynamically
    const triggerApi = useCallback(async (immediateValue?: string) => {

        const targetValue = immediateValue !== undefined ? immediateValue : value;
        const { hasToken, key } = parseTokenIdentifiers(targetValue);

        if (!hasToken) return;
        if (immediateValue !== undefined) {
            lastFetchedRef.current = "";
        }

        lastFetchedRef.current = key;

        try {
            // A clean, predictable invocation block with guaranteed query-state synchronization
            await refetch();
        } catch (error) {
            console.error("SmartSearchBar API Refetch Error:", error);
        }
    }, [value, refetch, parseTokenIdentifiers]);

    const resetFetched = useCallback(() => {
        lastFetchedRef.current = "";
    }, []);

    return {
        roundDetails,
        isRoundDetailsLoading,
        triggerApi,
        resetFetched,
    };
};