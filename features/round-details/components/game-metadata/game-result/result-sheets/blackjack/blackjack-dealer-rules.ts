import { CardDetailsInfo } from "@/features/round-details/types/card-details";
import { calculateBlackjackScore } from "./blackjack-score";
import { BlackjackDealerHand } from "./blackjack-types";
import {
  isCardEvent,
  isDealerEvent,
  isInsuranceEvent,
  sortBlackjackEvents,
} from "./blackjack-rules";

export const getDealerHand = (
  events: CardDetailsInfo,
  cardDetails: any[]
): BlackjackDealerHand => {

  const dealerEvents = sortBlackjackEvents(events).filter(isDealerEvent);

  // Filters out insurance and system placeholders cleanly via the updated isCardEvent
  const cards = dealerEvents
    .filter(isCardEvent)
    .map((e) => e.resultcode_id);

  // Scans dealer timeline flags to see if insurance was offered to seats this round
  const offeredInsurance = dealerEvents.some(isInsuranceEvent);

  const scoreResult = calculateBlackjackScore(cards, cardDetails);

  return {
    cards,
    score: scoreResult.score,
    isBust: scoreResult.isBust,
    isBlackjack: scoreResult.isBlackjack,
    offeredInsurance, // Passed to your transformation and layout layers
    events: dealerEvents,
  };
};