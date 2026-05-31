import { MiniPlayingCard, Rank, Suit } from "@/components/custom/games/playing-card";
import { BaccaratTelemetry } from "./types";
export function getCardBaccaratValue(rank: Rank): number {
  if (["10", "J", "Q", "K", "JKR"].includes(rank)) return 0;
  if (rank === "A") return 1;
  return parseInt(rank, 10);
}

export function calculateBaccaratScore(hand: { rank: Rank; suit: Suit }[]): number {
  const score = hand.reduce((acc, card) => acc + getCardBaccaratValue(card.rank), 0);
  return score % 10;
}

export function getPerfectBaccaratHand(
  playerCards: { rank: Rank; suit: Suit }[],
  bankerCards: { rank: Rank; suit: Suit }[]
): { playerFinal: { rank: Rank; suit: Suit }[]; bankerFinal: { rank: Rank; suit: Suit }[] } {
  if (playerCards.length < 2 || bankerCards.length < 2) {
    return { playerFinal: playerCards, bankerFinal: bankerCards };
  }

  // Core base pairs
  const playerFinal = [...playerCards.slice(0, 2)];
  const bankerFinal = [...bankerCards.slice(0, 2)];

  const pScore2 = calculateBaccaratScore(playerFinal);
  const bScore2 = calculateBaccaratScore(bankerFinal);

  // Natural Check
  if (pScore2 >= 8 || bScore2 >= 8) {
    return { playerFinal, bankerFinal };
  }

  // Step 1: Does Player draw?
  const playerNeedsThird = pScore2 <= 5;
  if (playerNeedsThird) {
    playerFinal.push(playerCards[2] || { rank: "A", suit: "S" });
  }

  // Step 2: Does Banker draw based on the true simulated state?
  let bankerNeedsThird = false;
  if (!playerNeedsThird) {
    bankerNeedsThird = bScore2 <= 5;
  } else {
    const p3Value = getCardBaccaratValue(playerFinal[2].rank);
    switch (bScore2) {
      case 0: case 1: case 2:
        bankerNeedsThird = true;
        break;
      case 3:
        bankerNeedsThird = p3Value !== 8;
        break;
      case 4:
        bankerNeedsThird = [2, 3, 4, 5, 6, 7].includes(p3Value);
        break;
      case 5:
        bankerNeedsThird = [4, 5, 6, 7].includes(p3Value);
        break;
      case 6:
        bankerNeedsThird = [6, 7].includes(p3Value);
        break;
      case 7:
        bankerNeedsThird = false;
        break;
    }
  }

  if (bankerNeedsThird) {
    bankerFinal.push(bankerCards[2] || { rank: "A", suit: "S" });
  }

  return { playerFinal, bankerFinal };
}

export function determineThirdCardRequirements(
  playerCards: { rank: Rank; suit: Suit }[],
  bankerCards: { rank: Rank; suit: Suit }[]
): { playerNeedsThird: boolean; bankerNeedsThird: boolean } {
  if (playerCards.length < 2 || bankerCards.length < 2) {
    return { playerNeedsThird: false, bankerNeedsThird: false };
  }

  const pScore2 = calculateBaccaratScore(playerCards.slice(0, 2));
  const bScore2 = calculateBaccaratScore(bankerCards.slice(0, 2));

  if (pScore2 >= 8 || bScore2 >= 8) {
    return { playerNeedsThird: false, bankerNeedsThird: false };
  }

  const playerNeedsThird = pScore2 <= 5;
  let bankerNeedsThird = false;

  if (!playerNeedsThird) {
    bankerNeedsThird = bScore2 <= 5;
  } else {
    const p3Card = playerCards[2];
    const p3Value = p3Card ? getCardBaccaratValue(p3Card.rank) : 0;

    switch (bScore2) {
      case 0: case 1: case 2:
        bankerNeedsThird = true;
        break;
      case 3:
        bankerNeedsThird = p3Value !== 8;
        break;
      case 4:
        bankerNeedsThird = [2, 3, 4, 5, 6, 7].includes(p3Value);
        break;
      case 5:
        bankerNeedsThird = [4, 5, 6, 7].includes(p3Value);
        break;
      case 6:
        bankerNeedsThird = [6, 7].includes(p3Value);
        break;
      case 7:
        bankerNeedsThird = false;
        break;
    }
  }

  return { playerNeedsThird, bankerNeedsThird };
}
function getCardValue(rank: Rank): number {
  if (["10", "J", "Q", "K"].includes(rank)) return 0;
  if (rank === "A") return 1;
  return parseInt(rank, 10) || 0;
}

// Helper to calculate total hand score
function calculateScore(cards: { rank: Rank; suit: Suit }[]): number {
  const total = cards.reduce((sum, card) => sum + getCardValue(card.rank), 0);
  return total % 10;
}

export function evaluateBaccaratHands(
  playerCards: { rank: Rank; suit: Suit }[],
  bankerCards: { rank: Rank; suit: Suit }[]
): BaccaratTelemetry {
  const playerScore = calculateScore(playerCards);
  const bankerScore = calculateScore(bankerCards);
  
  // 1. Calculate structural metrics
  const pointDifference = Math.abs(playerScore - bankerScore);
  
  // A natural is an 8 or 9 achieved within the initial two-card deal
  const isPlayerNatural = playerCards.length === 2 && (playerScore === 8 || playerScore === 9);
  const isBankerNatural = bankerCards.length === 2 && (bankerScore === 8 || bankerScore === 9);
  const natural = isPlayerNatural || isBankerNatural;

  const winner = playerScore > bankerScore 
    ? "player" 
    : bankerScore > playerScore 
      ? "banker" 
      : "tie";

  // 2. side-bet array collection evaluation block
  const betCodes: string[] = [];

  // Base rules mapping
  if (winner === "player") betCodes.push("0", "11"); // Player Wins, Player No Commission
  if (winner === "banker") betCodes.push("1", "10"); // Banker Wins, Banker No Commission
  if (winner === "tie") betCodes.push("2");

  // Pair evaluation on first two cards
  const playerPair = playerCards.length >= 2 && playerCards[0].rank === playerCards[1].rank;
  const bankerPair = bankerCards.length >= 2 && bankerCards[0].rank === bankerCards[1].rank;

  if (playerPair) betCodes.push("3", "21"); // Player Pair, Player Fortune Pair
  if (bankerPair) betCodes.push("4", "23"); // Banker Pair, Banker Fortune Pair
  if (playerPair || bankerPair) betCodes.push("9"); // Either Pair

  if (playerCards.length >= 2 && bankerCards.length >= 2) {
    const playerPerfect = playerCards[0].rank === playerCards[1].rank && playerCards[0].suit === playerCards[1].suit;
    const bankerPerfect = bankerCards[0].rank === bankerCards[1].rank && bankerCards[0].suit === bankerCards[1].suit;
    if (playerPerfect || bankerPerfect) betCodes.push("8"); // Perfect Pair
  }

  // Size calculations
  const totalCardsDealt = playerCards.length + bankerCards.length;
  if (totalCardsDealt === 4) betCodes.push("6"); // Small Hand
  if (totalCardsDealt === 5 || totalCardsDealt === 6) betCodes.push("7"); // Big Hand

  // Special Wins (Fortune 6 / Super 6)
  if (winner === "banker" && bankerScore === 6) {
    betCodes.push("5", "25"); // Super 6, Fortune 6 triggers
  }

  // Super 8 evaluation logic (Wins on point total 8 or specific margin values)
  if (pointDifference === 8 || playerScore === 8 || bankerScore === 8) {
    betCodes.push("20");
  }

  // Bonus conditions (Wins by a margin or Natural win)
  if (winner === "player" && (natural || pointDifference >= 4)) betCodes.push("12"); // Player Bonus
  if (winner === "banker" && (natural || pointDifference >= 4)) betCodes.push("13"); // Banker Bonus

  return {
    playerScore,
    bankerScore,
    calculatedBetCodes: betCodes,
    pointDifference,
    natural,
    winner
  };
}