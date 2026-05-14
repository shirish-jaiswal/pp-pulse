import {
  BlackjackDealerHand,
  BlackjackSeatHand,
} from "./blackjack-types";

export const getBlackjackWinners = (
  players: BlackjackSeatHand[],
  dealer: BlackjackDealerHand
) => {
  const winners: string[] = [];

  players.forEach((player) => {
    const id = `${player.seat}-Hand-${player.handNumber}`;

    /**
     * Player bust
     */
    if (player.isBust) {
      return;
    }

    /**
     * Dealer bust
     */
    if (
      dealer.isBust &&
      !player.isBust
    ) {
      winners.push(id);

      return;
    }

    /**
     * Blackjack beats normal hand
     */
    if (
      player.isBlackjack &&
      !dealer.isBlackjack
    ) {
      winners.push(id);

      return;
    }

    /**
     * Higher score wins
     */
    if (
      player.score > dealer.score &&
      player.score <= 21
    ) {
      winners.push(id);
    }
  });

  return winners;
};