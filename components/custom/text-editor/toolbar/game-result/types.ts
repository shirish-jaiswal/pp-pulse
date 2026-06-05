"use client";

export interface BaseStatus {
  label: string;
  variant: "success" | "danger" | "warning" | "default";
}

export interface UniversalGameHeader {
  title?: string;
  playerId: string;
  roundId: string;
  gameId: string;
  gameCrashedAt?: string; // Added to seamlessly support crash game configurations safely
}

export interface UniversalGameSection {
  title: string;
  subtitle: string;
  wager?: number;
  payout?: number;
  score?: string;
  status: BaseStatus;
  metrics?: Array<{ label: string; value: string }>;
  cards?: any[];
  actions?: string[];
}

export interface UniversalGameConfig {
  gameType: string; // Keeps registry lookup clean inside GameResultNode loops
  header?: UniversalGameHeader;
  sections: UniversalGameSection[];
  actions?: string[];
  [key: string]: any; // Catch-all fallback matrix support
}

export interface MultiGameResultConfig {
  gameType: "mixed" | string; 
  rounds: UniversalGameConfig[];
}