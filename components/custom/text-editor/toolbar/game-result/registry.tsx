"use client";

import React from "react";
import { UniversalGameConfig } from "./types";
import { BlackjackResultRenderer } from "./blackjack/BlackjackResultRenderer";
import { BaccaratResultRenderer } from "./baccarat/BaccaratResultRenderer";

// 1. Stub component for Poker as a demonstration of scaling
function PokerResultRenderer({ config }: { config: any }) {
  return (
    <div style={{ padding: "12px", fontFamily: "Arial", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px" }}>
      <strong style={{ color: "#166534" }}>♦ POKER SHOWDOWN ({config.header?.gameId || "N/A"})</strong>
      <div style={{ fontSize: "12px", marginTop: "4px" }}>Hand Rank: {config.handRank || "High Card"}</div>
    </div>
  );
}

// 2. The Registry Mapping Table
export const GAME_RENDER_REGISTRY: Record<
  string, 
  React.ComponentType<{ config: any }>
> = {
  blackjack: BlackjackResultRenderer,
  baccarat: BaccaratResultRenderer,
};

// 3. Fallback component if a game type is missing or mismatched
export function UnknownGameRenderer({ config }: { config: UniversalGameConfig }) {
  return (
    <div style={{ padding: "12px", border: "1px dashed #ef4444", borderRadius: "8px", backgroundColor: "#fef2f2", color: "#b91c1c", fontFamily: "monospace", fontSize: "12px" }}>
      <strong>[Unsupported Game Block]</strong>
      <div>Type: &quot;{config.gameType}&quot; is registered in payload data but missing layout renderer.</div>
    </div>
  );
}

// 4. Global helper to dynamically resolve components
export function getGameRenderer(gameType: string): React.ComponentType<{ config: any }> {
  if (!gameType) return UnknownGameRenderer;
  return GAME_RENDER_REGISTRY[gameType.toLowerCase().trim()] || UnknownGameRenderer;
}