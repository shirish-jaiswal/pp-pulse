"use client";

import { useEffect, useState } from "react";
import { ResolutionEditor } from "@/features/round-details/components/resolution-sheet/resolution-editor";
import { RoundInvestigator } from "@/features/round-details/components/investigator/round-investigator";
import { MultiRoundTabs } from "@/features/round-details/components/round-overview/multi-round-tab";
import RoundOverview from "@/features/round-details/components/round-overview/round-overview";
import GameMetadata from "@/features/round-details/components/round-overview/game-metadata";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import RoundAudit from "@/features/round-details/components/round-audit/round-audit";
import EmptyRoundData from "@/features/round-details/components/empty-round-data";
import { RoundFetchError } from "@/features/round-details/components/round-fetch-error";
import generateRoundOverview from "@/app/(dashboard)/round-activity/round-overview";

type RoundDetailsWrapperProps = {
    roundId?: string;
    gameId?: string;
    userId?: string;
};

import { c_getRoundDetails } from "@/lib/api/round-details/c_round-details";
import RoundDetailsSkeleton from "./round-details-skeleton";

export function RoundDetailsWrapper({ roundId, gameId, userId }: RoundDetailsWrapperProps) {
    const {
        setRoundDetailsInput,
        isBulkMode,
        roundDetails,
        setRoundDetails,
        setRoundOverview
    } = useRoundDetails();

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRoundDetailsInput({
            round_id: roundId,
            game_id: gameId,
            user_id: userId
        });
    }, [roundId, gameId, userId, setRoundDetailsInput]);

    useEffect(() => {
        const fetchData = async () => {
            const hasRequiredParams = roundId || (gameId && userId);
            if (!hasRequiredParams) return;

            setLoading(true);
            setError(false);

            try {
                const payload = roundId
                    ? { round_id: roundId }
                    : { game_id: gameId, user_id: userId };

                const data = await c_getRoundDetails(payload);

                setRoundDetails(data);

                const { roundOverview } = generateRoundOverview(data);
                setRoundOverview(roundOverview);

            } catch (err) {
                setError(true);
                setRoundDetails(null);
                setRoundOverview(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roundId, gameId, userId, setRoundDetails, setRoundOverview]);

    return (
        <div className="flex flex-col gap-2">
            <RoundInvestigator />

            {error && (
                <RoundFetchError
                    roundId={roundId}
                    gameId={gameId}
                    userId={userId}
                />
            )}

            {isBulkMode && <MultiRoundTabs />}

            {loading ? (
                <RoundDetailsSkeleton />
            ) : roundDetails ? (
                <>
                    <GameMetadata />
                    <RoundOverview />
                    <RoundAudit />
                    <ResolutionEditor gameName={"All"} />
                </>
            ) : (
                <EmptyRoundData />
            )}
        </div>
    );
}