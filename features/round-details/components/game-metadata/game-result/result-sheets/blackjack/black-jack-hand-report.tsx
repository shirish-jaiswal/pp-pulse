"use client";

import { useMemo } from "react";
import {
    MiniPlayingCard,
    Rank,
    Suit,
} from "@/components/custom/games/playing-card";
import { cn } from "@/utils/cn";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { useFindCards } from "@/hooks/excel-db/use-baccarat-cards";

import {
    getBlackjackRoundResult,
} from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/blackjack-round-result";
import LoadingSkeleton from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/skeleton";
import { ResultSheetHeaderBlock } from "@/features/round-details/components/game-metadata/game-result/result-sheets/result-sheet-header-block";

const BlackjackHandReport = () => {
    const { roundDetails } = useRoundDetails();

    const events = roundDetails?.cardDetails || [];
    const betTable = roundDetails?.betInfo || [];

    /**
     * 1. HOOKS MUST BE AT THE TOP
     */
    const resultCodes = useMemo(() => {
        return events
            .map((e) => e.resultcode_id)
            .filter(Boolean);
    }, [events]);

    const { data: cardDetails, isLoading } = useFindCards({
        code: resultCodes,
    });

    /**
     * 2. CONDITIONAL RETURN AFTER HOOKS
     */
    if (!events.length) {
        return (
            <div className="rounded-lg border bg-background p-5 text-center text-sm text-muted-foreground">
                No gameplay data available for this round
            </div>
        );
    }

    /**
     * RESULT
     */
    const result =
        getBlackjackRoundResult(
            events,
            cardDetails || [],
            betTable || []
        );

    const dealer = result.dealer;
    const players = result.players;
    const winners = result.winners;

    /**
     * BADGE
     */
    const Badge = ({
        label,
        variant = "default",
    }: {
        label: string;
        variant?:
        | "default"
        | "success"
        | "danger"
        | "warning";
    }) => {
        return (
            <div
                className={cn(
                    "rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    variant === "success" &&
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
                    variant === "danger" &&
                    "border-red-500/20 bg-red-500/10 text-red-700",
                    variant === "warning" &&
                    "border-amber-500/20 bg-amber-500/10 text-amber-700",
                    variant === "default" &&
                    "border-border bg-muted text-muted-foreground"
                )}
            >
                {label}
            </div>
        );
    };

    /**
     * CARD ROW
     */
    const CardRow = ({
        codes,
    }: {
        codes: string[];
    }) => {
        return (
            <div className="flex flex-wrap gap-2">
                {codes.map((code, i) => {
                    const card = cardDetails?.find(
                        (c: any) => c.code === code
                    );

                    if (!card) return null;

                    return (
                        <MiniPlayingCard
                            key={i}
                            rank={card.rank as Rank}
                            suit={card.suit as Suit}
                            size={48}
                        />
                    );
                })}
            </div>
        );
    };

    /**
     * DEALER SECTION
     */
    const DealerSection = () => {
        return (
            <div className="rounded-lg border bg-background p-3 space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-medium tracking-wide text-foreground">
                            DEALER
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Dealer Hand
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        {dealer.isBlackjack && (
                            <Badge
                                label="BLACKJACK"
                                variant="warning"
                            />
                        )}

                        {dealer.isBust && (
                            <Badge
                                label="BUST"
                                variant="danger"
                            />
                        )}

                        <div className="text-lg font-semibold tabular-nums">
                            {dealer.score}
                        </div>
                    </div>
                </div>

                <CardRow codes={dealer.cards} />
            </div>
        );
    };

    /**
     * PLAYER SECTION
     */
    const PlayerSection = ({ player }: any) => {
    const id = `${player.seat}-Hand-${player.handNumber}`;
    const isWinner = winners.includes(id);

    return (
        <div className={cn(
            "rounded-lg border bg-background p-3 space-y-3 transition-colors hover:border-primary/30",
            isWinner && "border-emerald-500/40 bg-emerald-500/5"
        )}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm font-medium tracking-wide text-foreground">
                        {"Seat " + player.seat}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Hand {player.handNumber}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                    {/* Render Insurance Taken Badge */}
                    {player.hasTakenInsurance && (
                        <Badge
                            label="INSURANCE TAKEN"
                            variant="success"
                        />
                    )}

                    {isWinner && <Badge label="WIN" variant="success" />}
                    {player.isBlackjack && <Badge label="BLACKJACK" variant="warning" />}
                    {player.isBust && <Badge label="BUST" variant="danger" />}
                    {player.isSoftHand && <Badge label="SOFT" variant="default" />}

                    <div className="text-lg font-semibold tabular-nums">
                        {player.score}
                    </div>
                </div>
            </div>

            <CardRow codes={player.cards} />

                {!!player.actions.length && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {player.actions.map(
                            (
                                action: string,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="rounded border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                                >
                                    {action}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="rounded-lg border bg-background p-3 space-y-3">
            {isLoading ? (
                <LoadingSkeleton />
            ) : (
                <>
                    <ResultSheetHeaderBlock />

                    <DealerSection />

                    <div className="grid gap-3 xl:grid-cols-2">
                        {players.map((player, index) => (
                            <PlayerSection
                                key={`${player.seat}-${player.handNumber}-${index}`}
                                player={player}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BlackjackHandReport;