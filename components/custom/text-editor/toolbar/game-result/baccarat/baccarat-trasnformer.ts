"use client";

import { CardDetailsInfo } from "@/features/round-details/types/card-details";
import { 
  getPlayerCodes, 
  getBankerCodes, 
  calculateBaccaratScore, 
  getBaccaratWinner 
} from "@/features/round-details/components/game-metadata/game-result/result-sheets/baccarat/baccarat-hand-report-rules";
import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";

interface BaccaratTransformerProps {
  roundDetails: RoundDetailsResponse | null;
  cardDetails: any[] | undefined;
}

/**
 * Transforms live Baccarat round metrics and hand evaluations 
 * into the layout configuration payload for the custom dynamic Lexical block renderer.
 */
export function transformBaccaratToConfig({ roundDetails, cardDetails }: BaccaratTransformerProps) {
  const events: CardDetailsInfo = roundDetails?.cardDetails || [];
  
  if (!events || events.length === 0) {
    return null;
  }

  // 1. Gather raw context data strings & numbers from round telemetry
  const playerCodes = getPlayerCodes(events);
  const bankerCodes = getBankerCodes(events);

  const playerScore = calculateBaccaratScore(playerCodes, cardDetails || []);
  const bankerScore = calculateBaccaratScore(bankerCodes, cardDetails || []);
  const winner = getBaccaratWinner(playerScore, bankerScore);

  // 2. Build the Document Header Block Context
  const header = {
    title: "BACCARAT GAME REPORT",
    roundId: String(roundDetails?.tptInfo?.at(0)?.round_id || "N/A"),
    playerId: String(roundDetails?.tptInfo?.at(0)?.user_id || "N/A"),
    gameId: String(roundDetails?.tptInfo?.at(0)?.game_id || "BACCARAT"),
  };

  // 3. Transform specific hand items into UI Card components layout data structure
  const mapCodesToCardConfig = (codes: string[]) => {
    return codes.map((code, index) => {
      const card = cardDetails?.find((c: any) => c.code === code);
      if (!card) return null;

      // Detect if it is the horizontal baccarat 3rd card draw event
      const isThirdCard = index === 2;

      return {
        rank: card.rank,
        suit: card.suit,
        actions: isThirdCard ? ["3rd Card", "Rotated"] : undefined,
      };
    }).filter(Boolean);
  };

  const playerCardConfig = mapCodesToCardConfig(playerCodes);
  const bankerCardConfig = mapCodesToCardConfig(bankerCodes);

  // 4. Construct structural content columns mapping sections array safely
  const sections = [
    {
      title: "PLAYER HAND",
      subtitle: winner === "PLAYER" ? "Natural Winner" : "Hand Result",
      score: `${playerScore} Points`,
      status: {
        label: winner === "PLAYER" ? "WINNER" : winner === "TIE" ? "TIE" : "LOSE",
        variant: winner === "PLAYER" ? "success" : winner === "TIE" ? "warning" : "default" as const,
      },
      cards: playerCardConfig,
      actions: winner === "PLAYER" ? ["Payout 1:1"] : undefined,
    },
    {
      title: "BANKER HAND",
      subtitle: winner === "BANKER" ? "🎉 Natural Winner" : "Hand Result",
      score: `${bankerScore} Points`,
      status: {
        label: winner === "BANKER" ? "WINNER" : winner === "TIE" ? "TIE" : "LOSE",
        variant: winner === "BANKER" ? "danger" : winner === "TIE" ? "warning" : "default" as const,
      },
      cards: bankerCardConfig,
      actions: winner === "BANKER" ? ["Payout 0.95:1"] : undefined,
    }
  ];

  // 5. Build supplementary footer details text metadata context items array if needed
  const globalActions: string[] = [];
  if (winner === "TIE") {
    globalActions.push("Tie Payout 8:1");
  }

  return {
    gameType: "baccarat",
    header,
    sections,
    actions: globalActions.length > 0 ? globalActions : undefined,
  };
}