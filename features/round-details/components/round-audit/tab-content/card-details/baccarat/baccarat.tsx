"use client";

import {
  MiniPlayingCard,
  Rank,
  Suit,
} from "@/components/custom/games/playing-card";
import { CardDetailsInfo } from "@/features/round-details/types/card-details";
import { useFindBaccaratCards } from "@/hooks/excel-db/use-baccarat-cards";
import { cn } from "@/utils/cn";
import React, { useMemo } from "react";

interface BaccaratHandReportProps {
  events?: CardDetailsInfo;
}

const BaccaratHandReport: React.FC<BaccaratHandReportProps> = ({
  events = [],
}) => {
  const resultCodes = useMemo(() => {
    if (!events) return [];
    return events.map((e) => e.resultcode_id).filter(Boolean);
  }, [events]);

  const { data: cardDetails, isLoading } = useFindBaccaratCards({
    code: resultCodes,
  });

  const calculateScore = (codes: string[]) => {
    if (!cardDetails) return 0;

    const total = codes.reduce((acc, code) => {
      const card = cardDetails.find((c: any) => c.code === code);
      if (!card) return acc;

      const rank = String(card.rank);

      if (rank === "A") return acc + 1;
      if (["10", "J", "Q", "K", "0"].includes(rank)) return acc;

      return acc + (parseInt(rank) || 0);
    }, 0);

    return total % 10;
  };

  if (!events || events.length === 0) {
    return (
      <div className="p-5 rounded-xl border bg-muted/30 text-sm text-muted-foreground text-center">
        No gameplay data available for this round
      </div>
    );
  }

  const playerCodes = events
    .filter(
      (e) =>
        e.event_type.includes("PLAYER") || e.state_indicator === 1
    )
    .map((e) => e.resultcode_id);

  const bankerCodes = events
    .filter(
      (e) =>
        e.event_type.includes("CARD_DEALT") &&
        e.state_indicator === 0
    )
    .map((e) => e.resultcode_id);

  const playerScore = calculateScore(playerCodes);
  const bankerScore = calculateScore(bankerCodes);
  const isTie = playerScore === bankerScore;

  const winner =
    isTie ? "TIE" : playerScore > bankerScore ? "PLAYER" : "BANKER";

  /**
   * CARD ROW (fix for spacing + rotation)
   */
  const CardRow = ({ codes }: { codes: string[] }) => {
    const firstTwo = codes.slice(0, 2);
    const third = codes[2];

    return (
      <div className="flex items-center gap-3">
        {/* First 2 cards */}
        {firstTwo.map((code, i) => {
          const card = cardDetails?.find((c: any) => c.code === code);
          return card ? (
            <MiniPlayingCard
              key={i}
              rank={card.rank as Rank}
              suit={card.suit as Suit}
              size={60}
            />
          ) : null;
        })}

        {/* Third card (separate → clean spacing) */}
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

  /**
   * PLAYER / BANKER SECTION
   */
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
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-sm font-semibold", color)}>
          {title}
        </span>

        <span className="text-xl font-bold text-foreground">
          {score}
        </span>
      </div>

      {/* CARDS */}
      <CardRow codes={codes} />
    </div>
  );

  return (
    <div className="rounded-xl p-2 bg-muted/20 border space-y-4">

      {/* RESULT */}
      <div className="flex justify-center">
        <div
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold",
            winner === "PLAYER" && "bg-blue-100 text-blue-700",
            winner === "BANKER" && "bg-red-100 text-red-700",
            winner === "TIE" && "bg-muted text-foreground"
          )}
        >
          {winner === "PLAYER"
            ? "Player Wins"
            : winner === "BANKER"
            ? "Banker Wins"
            : "Tie"}
        </div>
      </div>

      {/* MAIN */}
      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground py-6">
          Loading cards...
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
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

      {/* FOOTER */}
      {winner === "TIE" && (
        <div className="text-center text-xs text-muted-foreground">
          Tie payout 8:1
        </div>
      )}
    </div>
  );
};

export default BaccaratHandReport;