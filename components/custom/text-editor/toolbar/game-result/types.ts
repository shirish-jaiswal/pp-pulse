"use client";

export interface BaseStatus {
  label: string;
  variant: "success" | "danger" | "warning" | "default";
}

export interface BaseHeader {
  title: string;
  playerId: string;
  roundId: string;
  gameId: string;
}

export interface UniversalGameConfig {
  gameType: string; // Moved here to allow mixed-game lists!
  header?: {
    title: string;
    playerId: string;
    roundId: string;
    gameId: string;
  };
  sections: any[];
  [key: string]: any;
}

export interface MultiGameResultConfig {
  gameType: "mixed" | string; // Flags a heterogeneous or unified list
  rounds: UniversalGameConfig[];
}