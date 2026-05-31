"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { MiniPlayingCard, Rank, Suit } from "@/components/custom/games/playing-card";
import { determineThirdCardRequirements } from "./baccarat-utils";
import { cn } from "@/utils/cn";

interface Props {
  playerCards: { rank: Rank; suit: Suit }[];
  bankerCards: { rank: Rank; suit: Suit }[];
  onChange: (type: "player" | "banker", cards: { rank: Rank; suit: Suit }[]) => void;
  metrics: { playerScore: number; bankerScore: number };
}

const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS: Suit[] = ["S", "H", "D", "C"];
const SUIT_LABELS: Record<Suit, string> = { S: "♠ Spades", H: "♥ Hearts", D: "♦ Diamonds", C: "♣ Clubs" };

export function BaccaratPanel({ playerCards, bankerCards, onChange, metrics }: Props) {
  const [activePicker, setActivePicker] = useState<{ type: "player" | "banker"; index: number } | null>(null);

  // Automatically enforce third-card draw rules safely with conditional diff guards
  useEffect(() => {
    const { playerNeedsThird, bankerNeedsThird } = determineThirdCardRequirements(playerCards, bankerCards);

    // Sync Player 3rd card slot status safely
    if (playerNeedsThird && playerCards.length === 2) {
      onChange("player", [...playerCards, { rank: "A", suit: "S" }]);
      return;
    } else if (!playerNeedsThird && playerCards.length === 3) {
      onChange("player", playerCards.slice(0, 2));
      return;
    }

    // Sync Banker 3rd card slot status safely
    if (bankerNeedsThird && bankerCards.length === 2) {
      onChange("banker", [...bankerCards, { rank: "A", suit: "S" }]);
      return;
    } else if (!bankerNeedsThird && bankerCards.length === 3) {
      onChange("banker", bankerCards.slice(0, 2));
    }
  }, [playerCards, bankerCards, onChange]);

  const handleCardSelect = (rank: Rank, suit: Suit) => {
    if (!activePicker) return;
    const { type, index } = activePicker;
    const currentCards = type === "player" ? [...playerCards] : [...bankerCards];

    currentCards[index] = { rank, suit };
    onChange(type, currentCards);
    setActivePicker(null);
  };

  return (
    <div className="space-y-2 mt-1 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        
        {/* Player Hand Grid Box */}
        <div className="bg-white p-2 border border-slate-200 rounded shadow-sm space-y-1.5">
          <div className="px-0.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Player ({metrics.playerScore} Pts)
            </span>
          </div>
          <div className="flex gap-2">
            {playerCards.map((card, idx) => (
              <div 
                key={idx} 
                onClick={() => setActivePicker({ type: "player", index: idx })}
                className={cn(
                  "relative p-1 rounded border cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50", 
                  activePicker?.type === "player" && activePicker?.index === idx && "border-sky-500 ring-1 ring-sky-500/20",
                  idx === 2 && "bg-sky-50/20 border-dashed border-sky-300"
                )}
              >
                <MiniPlayingCard rank={card.rank} suit={card.suit} size={40} />
                {idx === 2 && (
                  <span className="absolute -bottom-1 -right-1 bg-sky-500 text-white rounded text-[7px] font-bold px-1 uppercase tracking-tight scale-90">Auto</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Banker Hand Grid Box */}
        <div className="bg-white p-2 border border-slate-200 rounded shadow-sm space-y-1.5">
          <div className="px-0.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Banker ({metrics.bankerScore} Pts)
            </span>
          </div>
          <div className="flex gap-2">
            {bankerCards.map((card, idx) => (
              <div 
                key={idx} 
                onClick={() => setActivePicker({ type: "banker", index: idx })}
                className={cn(
                  "relative p-1 rounded border cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50", 
                  activePicker?.type === "banker" && activePicker?.index === idx && "border-sky-500 ring-1 ring-sky-500/20",
                  idx === 2 && "bg-sky-50/20 border-dashed border-sky-300"
                )}
              >
                <MiniPlayingCard rank={card.rank} suit={card.suit} size={40} />
                {idx === 2 && (
                  <span className="absolute -bottom-1 -right-1 bg-sky-500 text-white rounded text-[7px] font-bold px-1 uppercase tracking-tight scale-90">Auto</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Light Theme Floating Selection Tray */}
      {activePicker && (
        <div className="bg-white text-slate-800 rounded p-2 border border-slate-200 shadow-lg space-y-2 animate-in fade-in-50 slide-in-from-top-1 duration-100">
          <div className="flex justify-between items-center border-b border-slate-100 pb-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Select Card for {activePicker.type.toUpperCase()} Slot #{activePicker.index + 1}
            </span>
            <button onClick={() => setActivePicker(null)}>
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
            </button>
          </div>
          <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
            {SUITS.map((suit) => (
              <div key={suit} className="flex items-center gap-2">
                <span className={cn("text-[10px] w-14 font-semibold text-right", (suit === "H" || suit === "D") ? "text-red-500" : "text-slate-500")}>
                  {SUIT_LABELS[suit]}
                </span>
                <div className="flex gap-1 overflow-x-auto">
                  {RANKS.map((rank) => (
                    <button 
                      key={rank} 
                      onClick={() => handleCardSelect(rank, suit)} 
                      className="text-xs bg-white hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300 text-slate-700 rounded w-5.5 h-5.5 flex items-center justify-center font-bold font-mono border border-slate-200 transition-all shadow-sm"
                    >
                      {rank}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}