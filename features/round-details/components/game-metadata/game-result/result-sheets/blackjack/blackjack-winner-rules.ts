import {
  BlackjackDealerHand,
  BlackjackSeatHand,
} from "./blackjack-types";

export const getBlackjackWinners = (
  players: BlackjackSeatHand[],
  dealer: BlackjackDealerHand
) => {
  const winners: string[] = [];
  const pushes: string[] = []; // Track push hands explicitly

  players.forEach((player) => {
    const id = `${player.seat}-Hand-${player.handNumber}`;

    // Player bust -> Instant Loss
    if (player.isBust) {
      return;
    }

    // Dealer bust -> Instant Win
    if (dealer.isBust && !player.isBust) {
      winners.push(id);
      return;
    }

    // Natural Blackjack beats a regular 21
    if (player.isBlackjack && !dealer.isBlackjack) {
      winners.push(id);
      return;
    }
    
    if (dealer.isBlackjack && !player.isBlackjack) {
      return; // Dealer blackjack beats player 21
    }

    // Higher score wins
    if (player.score > dealer.score) {
      winners.push(id);
      return;
    }

    // Exact tie score -> Push!
    if (player.score === dealer.score) {
      pushes.push(id);
    }
  });

  return { winners, pushes };
};