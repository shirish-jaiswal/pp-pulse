"use client";

import { useEffect } from "react";
import { ResolutionEditor } from "@/features/round-details/components/resolution-sheet/resolution-editor";
import { RoundInvestigator } from "@/features/round-details/components/investigator/round-investigator";
import { MultiRoundTabs } from "@/features/round-details/components/round-overview/multi-round-tab";
import RoundOverview from "@/features/round-details/components/round-overview/round-overview";
import GameMetadata from "@/features/round-details/components/round-overview/game-metadata";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import RoundAudit from "@/features/round-details/components/round-audit/round-audit";
import { MiniPlayingCard, Rank, Suit } from "@/components/custom/games/playing-card";
import EmptyRoundData from "@/features/round-details/components/empty-round-data";
import { RoundFetchError } from "@/features/round-details/components/round-fetch-error";
import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";
import { InfoCardProps } from "@/features/round-details/components/round-overview/info-card";

type RoundDetailsWrapperProps = {
    roundId?: string;
    gameId?: string;
    userId?: string;
    data: RoundDetailsResponse | null;
    roundOverview?: InfoCardProps[] | null;
    error?: boolean

};

export function RoundDetailsWrapper({ roundId, gameId, userId, data, roundOverview, error }: RoundDetailsWrapperProps) {
    const { setRoundDetailsInput, isBulkMode, roundDetails, setRoundDetails, setRoundOverview } = useRoundDetails();
    useEffect(() => {
        setRoundDetailsInput({
            round_id: roundId,
            game_id: gameId,
            user_id: userId
        });
    }, [roundId, gameId, userId, setRoundDetailsInput]);

    useEffect(() => {
        setRoundDetails(data);
        setRoundOverview(roundOverview ?? null);
    }, [data, roundOverview, setRoundDetails, setRoundOverview]);

    return (
        <div className="flex flex-col gap-2">
            <RoundInvestigator />
            {
                error &&
                <RoundFetchError roundId={roundId} gameId={gameId} userId={userId} />
            }
            {
                isBulkMode && <MultiRoundTabs />
            }
            {
                roundDetails ? (
                    <>
                        <GameMetadata />
                        <RoundOverview />
                        <RoundAudit />
                        <ResolutionEditor gameName={"All"} />
                    </>
                ) : (
                    <EmptyRoundData />
                )
            }
        </div>
    );
}


const DeckDisplay = () => {
    const suits: Suit[] = ['S', 'H', 'D', 'C'];
    const ranks: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Standard 52-Card Deck</h2>

            {/* Grid Layout: 13 cards per row */}
            <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-3">
                {suits.map((s) =>
                    ranks.map((r) => (
                        <div key={r + s} className="flex flex-col items-center">
                            <MiniPlayingCard rank={r} suit={s} size={60} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};