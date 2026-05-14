import { CardDetailsInfo } from "@/features/round-details/types/card-details";

export const getPlayerCodes = (events: CardDetailsInfo) => {
  return events
    .filter(
      (e) =>
        e.event_type.includes("PLAYER") || e.state_indicator === 1
    )
    .map((e) => e.resultcode_id);
};

export const getBankerCodes = (events: CardDetailsInfo) => {
  return events
    .filter(
      (e) =>
        e.event_type.includes("CARD_DEALT") &&
        e.state_indicator === 0
    )
    .map((e) => e.resultcode_id);
};

export const calculateBaccaratScore = (
  codes: string[],
  cardDetails: any[]
) => {
  if (!cardDetails) return 0;

  const total = codes.reduce((acc, code) => {
    const card = cardDetails.find((c: any) => c.code === code);

    if (!card) return acc;

    const rank = String(card.rank);

    if (rank === "A") return acc + 1;

    if (["10", "J", "Q", "K", "0"].includes(rank)) {
      return acc;
    }

    return acc + (parseInt(rank) || 0);
  }, 0);

  return total % 10;
};

export const getBaccaratWinner = (
  playerScore: number,
  bankerScore: number
) => {
  if (playerScore === bankerScore) {
    return "TIE";
  }

  return playerScore > bankerScore ? "PLAYER" : "BANKER";
};

export const getBaccaratWinnerFromEvents = (
  events: CardDetailsInfo,
  cardDetails: any[]
) => {
  const playerCodes = events
    .filter(
      (e) =>
        e.event_type.includes("PLAYER") ||
        e.state_indicator === 1
    )
    .map((e) => e.resultcode_id);

  const bankerCodes = events
    .filter(
      (e) =>
        e.event_type.includes("CARD_DEALT") &&
        e.state_indicator === 0
    )
    .map((e) => e.resultcode_id);

  const calculateScore = (codes: string[]) => {
    const total = codes.reduce((acc, code) => {
      const card = cardDetails.find(
        (c: any) => c.code === code
      );

      if (!card) return acc;

      const rank = String(card.rank);

      if (rank === "A") return acc + 1;

      if (["10", "J", "Q", "K", "0"].includes(rank)) {
        return acc;
      }

      return acc + (parseInt(rank) || 0);
    }, 0);

    return total % 10;
  };

  const playerScore = calculateScore(playerCodes);

  const bankerScore = calculateScore(bankerCodes);

  if (playerScore === bankerScore) {
    return "TIE";
  }

  return playerScore > bankerScore
    ? "PLAYER"
    : "BANKER";
};