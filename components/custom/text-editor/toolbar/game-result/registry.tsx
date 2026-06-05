"use client";

import React from "react";
import { UniversalGameConfig } from "./types";
import { BlackjackResultRenderer } from "./blackjack/BlackjackResultRenderer";
import { BaccaratResultRenderer } from "./baccarat/BaccaratResultRenderer";
import { HighflyerResultRenderer } from "./carash-games/highflyer-result-renderer";
import { SpacemanResultRenderer } from "./carash-games/SpacemanResultRenderer";

export const GAME_RENDER_REGISTRY: Record<
  string, 
  React.ComponentType<{ config: any }>
> = {
  blackjack: BlackjackResultRenderer,
  baccarat: BaccaratResultRenderer,
  spaceman: SpacemanResultRenderer,
  "big-bass": SpacemanResultRenderer,
  highflyer: HighflyerResultRenderer,
};

export function UnknownGameRenderer({ config }: { config: UniversalGameConfig }) {
  return (
    <div style={{ padding: "12px", border: "1px dashed #ef4444", borderRadius: "8px", backgroundColor: "#fef2f2", color: "#b91c1c", fontFamily: "monospace", fontSize: "12px" }}>
      <strong>[Unsupported Game Block]</strong>
      <div>Type: &quot;{config.gameType}&quot; is registered in payload data but missing layout renderer.</div>
    </div>
  );
}

export function getGameRenderer(gameType: string): React.ComponentType<{ config: any }> {
  if (!gameType) return UnknownGameRenderer;
  return GAME_RENDER_REGISTRY[gameType.toLowerCase().trim()] || UnknownGameRenderer;
}