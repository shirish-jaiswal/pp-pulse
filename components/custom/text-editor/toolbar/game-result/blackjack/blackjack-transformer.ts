// Import the shared type structures directly from your layout renderer file
// CHANGE THIS PATH to match wherever your GameResultRenderer file lives

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
    cards: string[];
  };
  players: Array<{
    seat: number;
    handNumber: number;
    score: number;
    isBlackjack: boolean;
    isBust: boolean;
    isSoftHand: boolean;
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

  const sections: Section[] = [
    {
      title: "DEALER",
      subtitle: "Dealer Hand",
      score: String(dealer.score),
      status: dealer.isBlackjack
        ? { label: "BLACKJACK", variant: "warning" }
        : dealer.isBust
        ? { label: "BUST", variant: "danger" }
        : undefined,
      cards: dealer.cards.map((code: string) => {
        const found = cardDetails?.find((c) => c.code === code);
        return {
          rank: found?.rank || code,
          suit: (found?.suit?.toLowerCase() || "spades") as "spades" | "hearts" | "diamonds" | "clubs",
        };
      }),
      actions: [],
    },
  ];

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
    } else if (player.isSoftHand) {
      label = "SOFT";
    }

    sections.push({
      title: `Seat ${player.seat}`,
      subtitle: `Hand ${player.handNumber}`,
      score: String(player.score),
      status: { label, variant },
      cards: player.cards.map((code: string) => {
        const found = cardDetails?.find((c) => c.code === code);
        return {
          rank: found?.rank || code,
          suit: (found?.suit?.toLowerCase() || "spades") as "spades" | "hearts" | "diamonds" | "clubs",
        };
      }),
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