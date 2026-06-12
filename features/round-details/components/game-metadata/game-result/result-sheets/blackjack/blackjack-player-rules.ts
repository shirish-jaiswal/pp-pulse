import { CardDetailsInfo } from "@/features/round-details/types/card-details";
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";

import { calculateBlackjackScore } from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/blackjack-score";
import { BlackjackSeatHand } from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/blackjack-types";

import {
  isCardEvent,
  isDealerEvent,
  isDecisionEvent,
  sortBlackjackEvents,
} from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/blackjack-rules";

const normalizeSeat = (seat: string | number): number | null => {
  if (typeof seat === "number") return seat;

  const match = String(seat).match(/(\d+)/);
  return match ? Number(match[1]) : null;
};

const getActiveSeats = (betDetails: BetTableInfo) => {
  return new Set(
    betDetails
      .map((bet) => {
        const source =
          bet.displayDescription || bet.description;

        const match = String(source).match(/seat\s*(\d+)/i);

        return match ? Number(match[1]) : null;
      })
      .filter((v): v is number => v !== null)
  );
};

export const getBlackjackPlayers = (
  events: CardDetailsInfo,
  cardDetails: any[],
  betDetails: BetTableInfo
): BlackjackSeatHand[] => {
  const sortedEvents = sortBlackjackEvents(events);
  const activeSeats = getActiveSeats(betDetails);

  // 1. Create a Set of seats that accepted insurance
  const insuredSeats = new Set<number>(
    betDetails
      .map((bet) => {
        const source = bet.displayDescription || bet.description;
        if (!source || !/insurance/i.test(source)) return null;

        const match = source.match(/seat\s*(\d+)/i);
        return match ? Number(match[1]) : null;
      })
      .filter((v): v is number => v !== null)
  );

  const grouped = new Map<string, BlackjackSeatHand>();

  sortedEvents.forEach((event) => {
    if (isDealerEvent(event)) return;

    const seat = normalizeSeat(event.seat_number);
    if (seat === null || !activeSeats.has(seat)) return;

    const key = `${seat}-${event.hand_number}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        seat,
        handNumber: event.hand_number,
        cards: [],
        actions: [],
        score: 0,
        isBust: false,
        isBlackjack: false,
        isSoftHand: false,
        stateIndicator: event.state_indicator,
        hasTakenInsurance: insuredSeats.has(seat), // 2. Map structural state match here
        events: [],
      });
    }

    const hand = grouped.get(key)!;
    hand.events.push(event);

    if (isCardEvent(event)) {
      hand.cards.push(event.resultcode_id);
    }

    if (isDecisionEvent(event)) {
      hand.actions.push(event.event_value);
    }
  });

  // Calculate scores loop remains unchanged...
  grouped.forEach((hand) => {
    const result = calculateBlackjackScore(hand.cards, cardDetails);
    hand.score = result.score;
    hand.isBust = result.isBust;
    hand.isBlackjack = result.isBlackjack;
    hand.isSoftHand = result.isSoftHand;
  });

  return Array.from(grouped.values());
};