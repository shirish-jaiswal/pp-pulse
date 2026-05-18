import { useCallback, useMemo, useRef } from "react";
import useGetRoundDetails from "@/features/round-details/hook/use-get-round-details";
import { parseTptToken } from "./utils/parse-token";

interface UseSmartSearchApiProps {
    value: string;
}

export const useSmartSearchApi = ({
    value,
}: UseSmartSearchApiProps) => {
    const lastFetchedRef =
        useRef("");
    const parsedToken =
        useMemo(() => {
            return parseTptToken(value);
        }, [value]);
    const roundId =
        parsedToken?.roundId || "";
    const gameId =
        parsedToken?.gameId || "";
    const userId =
        parsedToken?.userId || "";
    const hasApiToken =
        value.includes("@") &&
        !!(
            roundId ||
            gameId ||
            userId
        );
    const queryKey =
        `${roundId}-${gameId}-${userId}`;
    const {
        data: roundDetails,
        isLoading:
            isRoundDetailsLoading,
        refetch,
    } = useGetRoundDetails({
        round_id: roundId,
        game_id:
            gameId === "game"
                ? ""
                : gameId,
        user_id:
            userId === "user"
                ? ""
                : userId,
        enabled: false,
    });
    const triggerApi =
        useCallback(async () => {
            if (!hasApiToken) {
                return;
            }
            if (
                lastFetchedRef.current ===
                queryKey
            ) {
                return;
            }
            lastFetchedRef.current =
                queryKey;
            await refetch();
        }, [
            hasApiToken,
            queryKey,
            refetch,
        ]);
    const resetFetched =
        useCallback(() => {
            lastFetchedRef.current =
                "";
        }, []);

    return {
        roundDetails,
        hasApiToken,
        isRoundDetailsLoading,
        triggerApi,
        resetFetched,
    };
};