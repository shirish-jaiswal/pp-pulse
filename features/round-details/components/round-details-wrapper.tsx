"use client";

import { useEffect } from "react";
import { ResolutionEditor } from "@/features/round-details/components/resolution-sheet/resolution-editor";
import { RoundInvestigator } from "@/features/round-details/components/investigator/round-investigator";
import RoundOverview from "@/features/round-details/components/round-overview/round-overview";
import GameMetadata from "@/features/round-details/components/round-overview/game-metadata";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import RoundAudit from "@/features/round-details/components/round-audit/round-audit";
import { MiniPlayingCard, Rank, Suit } from "@/components/custom/games/playing-card";
import { ProfessionalRoulette } from "@/components/custom/games/roulette-table";
import EmptyRoundData from "@/features/round-details/components/empty-round-data";
import { MultiRoundTabs } from "@/features/round-details/components/round-overview/multi-round-tab";

type RoundDetailsWrapperProps = {
    roundId?: string;
    gameId?: string;
    userId?: string;
    data?: any
};

const myBets = {
    "0": 1.5,                 // Straight Up (0 Green)
    "2": 1.0,                 // Straight Up
    "4": 0.5,                 // Straight Up
    "17": 1.0,                // Straight Up
    "20": 1.5,                // Straight Up
    "21": 0.5,                // Straight Up
    "black": 2.0,             // Outside Bet
    "1-4": 0.5,               // Split
    "4-7": 0.5,               // Split
    "17-18-20-21": 0.5        // Corner
};
export function RoundDetailsWrapper({ roundId, gameId, userId, data }: RoundDetailsWrapperProps) {
    const { setRoundDetailsInput, isBulkMode } = useRoundDetails();
    useEffect(() => {
        setRoundDetailsInput({
            round_id: roundId,
            game_id: gameId,
            user_id: userId
        });
    }, [roundId, gameId, userId, setRoundDetailsInput]);

    return (
        <div className="flex flex-col gap-2">
            <RoundInvestigator />
            {
                isBulkMode && <MultiRoundTabs />
            }
            {
                data ? (
                    <>
                        <GameMetadata />
                        <RoundOverview />
                        <RoundAudit data={data} />
                        <ResolutionEditor gameName={data?.game_name} />
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