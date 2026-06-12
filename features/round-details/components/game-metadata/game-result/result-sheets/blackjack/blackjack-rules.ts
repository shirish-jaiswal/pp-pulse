import { CardDetailsInfo } from "@/features/round-details/types/card-details";

export const sortBlackjackEvents = (
  events: CardDetailsInfo
) => {
  return [...events].sort((a, b) => {
    /**
     * Priority 1 -> result_order
     */
    if (
      a.result_order != null &&
      b.result_order != null
    ) {
      return a.result_order - b.result_order;
    }

    if (
      a.result_order != null &&
      b.result_order == null
    ) {
      return -1;
    }

    if (
      a.result_order == null &&
      b.result_order != null
    ) {
      return 1;
    }

    /**
     * Priority 2 -> time
     */
    return (
      new Date(a.result_time).getTime() -
      new Date(b.result_time).getTime()
    );
  });
};

export const isDealerEvent = (
  event: CardDetailsInfo[number]
) => {
  return event.seat_number === "Dealer";
};

export const isPlayerEvent = (
  event: CardDetailsInfo[number]
) => {
  return event.seat_number !== "Dealer";
};

export const isCardEvent = (
  event: CardDetailsInfo[number]
) => {
  if (!event.resultcode_id) return false;

  if (event.resultcode_id.startsWith("blackjack")) {
    return false;
  }

  return true;
};

export const isDecisionEvent = (
  event: CardDetailsInfo[number]
) => {
  return event.event_type === "PLAYER_DECISION";
};

// Added export to fix the compilation error
export const isInsuranceEvent = (
  event: CardDetailsInfo[number]
) => {
  return event.event_type === "DEALER_INSURANCE";
};