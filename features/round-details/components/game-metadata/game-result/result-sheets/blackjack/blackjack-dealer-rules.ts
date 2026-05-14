import { CardDetailsInfo } from "@/features/round-details/types/card-details";

import {
  calculateBlackjackScore,
} from "./blackjack-score";

import {
  BlackjackDealerHand,
} from "./blackjack-types";

import {
  isCardEvent,
  isDealerEvent,
  sortBlackjackEvents,
} from "./blackjack-rules";

export const getDealerHand = (
  events: CardDetailsInfo,
  cardDetails: any[]
): BlackjackDealerHand => {

  const dealerEvents =
    sortBlackjackEvents(events).filter(
      isDealerEvent
    );

  const cards = dealerEvents
    .filter(isCardEvent)
    .map((e) => e.resultcode_id);

  const scoreResult =
    calculateBlackjackScore(
      cards,
      cardDetails
    );

  return {
    cards,

    score: scoreResult.score,

    isBust: scoreResult.isBust,

    isBlackjack:
      scoreResult.isBlackjack,

    events: dealerEvents,
  };
};