export const calculateBlackjackScore = (
  codes: string[],
  cardDetails: any[]
) => {
  let total = 0;
  let aces = 0;

  const cards: any[] = [];

  for (const code of codes) {
    const card = cardDetails.find((c) => c.code === code);

    if (!card) continue;

    cards.push(card);

    const rank = String(card.rank);

    // Ace
    if (rank === "1" || rank === "A") {
      aces += 1;
      total += 11;
      continue;
    }

    // Face cards
    if (["K", "Q", "J", "10", "0"].includes(rank)) {
      total += 10;
      continue;
    }

    total += parseInt(rank) || 0;
  }

  // Convert Ace from 11 -> 1 if busted
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  // Blackjack only if:
  // first card = Ace
  // second card = 10/J/Q/K
  const firstRank = String(cards?.[0]?.rank);
  const secondRank = String(cards?.[1]?.rank);

  const isBlackjack =
    cards.length === 2 &&
    (firstRank === "1" || firstRank === "A") &&
    ["K", "Q", "J", "10", "0"].includes(secondRank);

  return {
    score: total,
    isSoftHand: aces > 0,
    isBust: total > 21,
    isBlackjack,
  };
};