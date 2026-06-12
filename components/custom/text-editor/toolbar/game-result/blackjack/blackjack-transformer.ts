// Import the shared type structures directly from your layout renderer file
import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";
import { BlackjackResultConfig, Section } from "@/components/custom/text-editor/toolbar/game-result/blackjack/BlackjackResultRenderer";

interface CardDetail {
  code: string;
  rank: string;
  suit: string;
}

interface BlackjackResult {
  dealer: {
    score: number;
    isBlackjack: boolean;
    isBust: boolean;
    offeredInsurance?: boolean; // Track global insurance configuration status
    cards: string[];
  };
  players: Array<{
    seat: number;
    handNumber: number;
    score: number;
    isBlackjack: boolean;
    isBust: boolean;
    isSoftHand: boolean;
    hasTakenInsurance?: boolean; 
    actions: string[];
    cards: string[];
  }>;
  winners: string[];
}

interface TransformArgs {
  roundDetails: RoundDetailsResponse | null;
  result: BlackjackResult | null;
  cardDetails: CardDetail[] | undefined;
}
export function transformBlackjackToConfig({
  roundDetails,
  result,
  cardDetails,
}: TransformArgs): BlackjackResultConfig | null {
  if (!roundDetails || !result) return null;

  const { dealer, players, winners } = result;

  // 1. Resolve Dealer Global Status Layout Properties
  let dealerLabel: string | undefined = undefined;
  let dealerVariant: "success" | "danger" | "warning" | "default" = "default";

  if (dealer.isBlackjack) {
    dealerLabel = "BLACKJACK";
    dealerVariant = "warning";
  } else if (dealer.isBust) {
    dealerLabel = "BUST";
    dealerVariant = "danger";
  } else if (dealer.offeredInsurance) {
    dealerLabel = "INSURANCE OFFERED";
    dealerVariant = "warning";
  }

  const dealerValidCards = dealer.cards
    .map((code: string) => cardDetails?.find((c) => c.code === code))
    .filter((found): found is CardDetail => !!found && !found.code.startsWith("blackjack"))
    .map((found) => ({
      rank: found.rank,
      suit: (found.suit?.toLowerCase() || "spades") as "spades" | "hearts" | "diamonds" | "clubs",
    }));

  const sections: Section[] = [
    {
      title: "DEALER",
      subtitle: "Dealer Hand",
      score: String(dealer.score),
      status: dealerLabel ? { label: dealerLabel, variant: dealerVariant } : undefined,
      cards: dealerValidCards, 
      actions: [],
    },
  ];

  // 2. Loop and Resolve Active Seat Specific Config Layout Structures
  players.forEach((player) => {
    const id = `${player.seat}-Hand-${player.handNumber}`;
    const isWinner = winners.includes(id);

    let variant: "success" | "danger" | "warning" | "default" = "default";
    let label = "";

    if (isWinner) {
      variant = "success";
      label = "WIN";
    } else if (player.isBlackjack) {
      variant = "warning";
      label = "BLACKJACK";
    } else if (player.isBust) {
      variant = "danger";
      label = "BUST";
    } else if (player.hasTakenInsurance) {
      variant = "warning";
      label = "INSURANCE TAKEN";
    } else if (player.isSoftHand) {
      label = "SOFT";
    }

    const playerValidCards = player.cards
      .map((code: string) => cardDetails?.find((c) => c.code === code))
      .filter((found): found is CardDetail => !!found && !found.code.startsWith("blackjack"))
      .map((found) => ({
        rank: found.rank,
        suit: (found.suit?.toLowerCase() || "spades") as "spades" | "hearts" | "diamonds" | "clubs",
      }));

    sections.push({
      title: `Seat ${player.seat}`,
      subtitle: `Hand ${player.handNumber}`,
      score: String(player.score),
      status: label ? { label, variant } : undefined,
      cards: playerValidCards,
      actions: player.actions || [],
    });
  });

  return {
    gameType: "blackjack",
    header: {
      title: "Blackjack Performance Report",
      playerId: String(roundDetails.tptInfo?.at(0)?.user_id || "N/A"),
      roundId: String(roundDetails.tptInfo?.at(0)?.round_id || "N/A"),
      gameId: String(roundDetails.tptInfo?.at(0)?.game_id || "N/A"),
    },
    sections,
  };
}