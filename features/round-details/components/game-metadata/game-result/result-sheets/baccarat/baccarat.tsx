"use client";

import React, { useMemo } from "react";

import {
  MiniPlayingCard,
  Rank,
  Suit,
} from "@/components/custom/games/playing-card";

import { CardDetailsInfo } from "@/features/round-details/types/card-details";

import { useFindCards } from "@/hooks/excel-db/use-baccarat-cards";

import { cn } from "@/utils/cn";

import {
  calculateBaccaratScore,
  getBankerCodes,
  getBaccaratWinner,
  getPlayerCodes,
} from "@/features/round-details/components/game-metadata/game-result/result-sheets/baccarat/baccarat-hand-report-rules";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { ResultSheetHeaderBlock } from "../result-sheet-header-block";

interface BaccaratHandReportProps {
  events?: CardDetailsInfo;
}

const BaccaratHandReport: React.FC<BaccaratHandReportProps> = () => {
  const { roundDetails } = useRoundDetails();
  const events = roundDetails?.cardDetails || [];
  const resultCodes = useMemo(() => {
    if (!events) return [];

    return events
      .map((e) => e.resultcode_id)
      .filter(Boolean);
  }, [events]);

  const { data: cardDetails, isLoading } =
    useFindCards({
      code: resultCodes,
    });

  if (!events || events.length === 0) {
    return (
      <div className="p-5 rounded-xl border bg-muted/30 text-sm text-muted-foreground text-center">
        No gameplay data available for this round
      </div>
    );
  }

  const playerCodes = getPlayerCodes(events);

  const bankerCodes = getBankerCodes(events);

  const playerScore = calculateBaccaratScore(
    playerCodes,
    cardDetails || []
  );

  const bankerScore = calculateBaccaratScore(
    bankerCodes,
    cardDetails || []
  );

  const winner = getBaccaratWinner(
    playerScore,
    bankerScore
  );

  /**
   * CARD ROW
   */
  const CardRow = ({
    codes,
  }: {
    codes: string[];
  }) => {
    const firstTwo = codes.slice(0, 2);

    const third = codes[2];

    return (
      <div className="flex items-center gap-3">
        {firstTwo.map((code, i) => {
          const card = cardDetails?.find(
            (c: any) => c.code === code
          );

          return card ? (
            <MiniPlayingCard
              key={i}
              rank={card.rank as Rank}
              suit={card.suit as Suit}
              size={60}
            />
          ) : null;
        })}

        {third && (
          <div className="flex flex-col items-center ml-2">
            <span className="text-[9px] text-muted-foreground mb-1">
              3rd
            </span>

            <div className="rotate-90 scale-95">
              {(() => {
                const card = cardDetails?.find(
                  (c: any) => c.code === third
                );

                return card ? (
                  <MiniPlayingCard
                    rank={card.rank as Rank}
                    suit={card.suit as Suit}
                    size={60}
                  />
                ) : null;
              })()}
            </div>
          </div>
        )}
      </div>
    );
  };

  const Section = ({
    title,
    color,
    score,
    codes,
    isWinner,
  }: any) => (
    <div
      className={cn(
        "flex-1 rounded-xl p-4 transition shadow-sm",
        "bg-white border",
        isWinner && "ring-2 ring-emerald-400"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-sm font-semibold", color)}>
          {title}
        </span>

        <span className="text-xl font-bold text-foreground">
          {score}
        </span>
      </div>

      <CardRow codes={codes} />
    </div>
  );

  return (
    <div className="rounded-xl p-2 bg-muted/20 border space-y-4">
      <ResultSheetHeaderBlock />

      <div className="flex justify-center">
        <div
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold",
            winner === "PLAYER" &&
            "bg-blue-100 text-blue-700",
            winner === "BANKER" &&
            "bg-red-100 text-red-700",
            winner === "TIE" &&
            "bg-muted text-foreground"
          )}
        >
          {winner === "PLAYER"
            ? "Player Wins"
            : winner === "BANKER"
              ? "Banker Wins"
              : "Tie"}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground py-6">
          Loading cards...
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          <Section
            title="PLAYER"
            color="text-blue-600"
            score={playerScore}
            codes={playerCodes}
            isWinner={winner === "PLAYER"}
          />

          <Section
            title="BANKER"
            color="text-red-600"
            score={bankerScore}
            codes={bankerCodes}
            isWinner={winner === "BANKER"}
          />
        </div>
      )}

      {winner === "TIE" && (
        <div className="text-center text-xs text-muted-foreground">
          Tie payout 8:1
        </div>
      )}
    </div>
  );
};

export default BaccaratHandReport;