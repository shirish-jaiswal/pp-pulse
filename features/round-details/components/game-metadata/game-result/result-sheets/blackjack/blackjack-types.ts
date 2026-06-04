import { CardDetailsInfo } from "@/features/round-details/types/card-details";

export interface BlackjackSeatHand {
  seat: number;
  handNumber: number;
  cards: string[];
  actions: string[];
  score: number;
  isBust: boolean;
  isBlackjack: boolean;
  isSoftHand: boolean;
  stateIndicator: number;
  events: CardDetailsInfo[number][];
}

export interface BlackjackDealerHand {
  cards: string[];
  score: number;
  isBust: boolean;
  isBlackjack: boolean;
  events: CardDetailsInfo[number][];
}

export interface BlackjackRoundResult {
  dealer: BlackjackDealerHand;
  players: BlackjackSeatHand[];
  winners: string[];
  pushes: string[];
}