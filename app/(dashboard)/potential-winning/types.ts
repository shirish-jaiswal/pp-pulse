import { evaluateBaccaratHands } from "./baccarat-utils";
export type Suit = "H" | "D" | "S" | "C";
export type Rank =
  | "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
  | "J" | "Q" | "K" | "JKR";
export interface PayoutRow {
  id: string | number;
  description: string;
  bet_codes: string | number;
  short_desc: string;
  payout: string; 
}

export interface ParsedBet {
  bc: string;
  amt: number;
}

export interface CalculationDetail {
  betCode: string;
  betDescription: string;
  amountPlaced: number;
  isWinner: boolean;
  winAmount: number;
}

export interface CalculationResult {
  totalWager: number;
  totalPayout: number;
  winningDescription: string;
  winningRatio: string;
  details: CalculationDetail[];
}

// Add or update this type in your types file
export interface BaccaratTelemetry {
  playerScore: number;
  bankerScore: number;
  calculatedBetCodes: string[];
  pointDifference: number; // Absolute difference between scores (0-9)
  natural: boolean;         // True if either hand has an 8 or 9 on the first 2 cards
  winner: "player" | "banker" | "tie";
}

// Update your GameStrategy interface if context needs explicit typing
export interface GameStrategy {
  calculate: (
    selectedResultBc: string,
    payouts: PayoutRow[],
    parsedBets: ParsedBet[],
    context?: {
      playerCards: { rank: Rank; suit: Suit }[];
      bankerCards: { rank: Rank; suit: Suit }[];
    }
  ) => CalculationResult | null;
}