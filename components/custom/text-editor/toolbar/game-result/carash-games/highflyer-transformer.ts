"use client";

import { HighflyerBetSchema } from "@/features/round-details/types/highflyer";
import { getGameType } from "@/utils/get-game-type";
import z from "zod";

interface HighflyerTransformerProps {
  roundDetails: any;
}

export function transformHighflyerToConfig({ roundDetails }: HighflyerTransformerProps) {
  const rawGameType = roundDetails?.gameDetails?.at(0)?.game_type || "";
  const gameType = getGameType(rawGameType.toLowerCase()) || "highflyer"; 

  const roundId = String(roundDetails?.tptInfo?.at(0)?.round_id || "N/A");
  const stateIndicator = roundDetails?.gameDetails?.[0]?.state_indicator;
  const gameCrashedAt = stateIndicator ? (Number(stateIndicator) / 100).toFixed(2) : "BUST";

  if (!Array.isArray(roundDetails?.highflyerData) || roundDetails.highflyerData.length === 0) {
    return null;
  }

  const result = z.array(HighflyerBetSchema).safeParse(roundDetails.highflyerData);
  
  if (!result.success) {
    console.error(
      JSON.stringify(result.error.flatten().fieldErrors, null, 2)
    );
    return null;
  }

  const validBets = result.data;
  const gameId = validBets[0]?.game_id || "N/A";
  const playerId = validBets[0]?.user_id || "N/A";

  const sections = validBets.map((bet, index) => {
    const isBusted = bet.multiplier === -1 || bet.multiplier <= 0;
    const payoutReceived = isBusted ? 0 : bet.bet_amount * bet.multiplier;
    
    const rawTarget = bet.auto_cash_out ?? bet.requested_cash_out ?? bet.force_cash_out;
    const targetThreshold = rawTarget && rawTarget !== -1 ? `${rawTarget.toFixed(2)}x` : "None";

    let cashOutType = "Not Settled";
    if (isBusted) cashOutType = "Bust / Lost";
    else if (bet.force_cash_out) cashOutType = "Force Trigger";
    else if (bet.auto_cash_out || bet.requested_cash_out) cashOutType = "Auto Engine";
    else if (bet.multiplier > 0) cashOutType = "Manual Exit";

    return {
      title: `BET SPOT POSITION #0${index + 1}`,
      subtitle: `Bet ID: ${bet.bet_id}`,
      wager: bet.bet_amount,
      payout: payoutReceived,
      status: {
        label: cashOutType.toUpperCase(),
        variant: isBusted ? ("danger" as const) : ("success" as const),
      },
      metrics: [
        { label: "Target Setup", value: targetThreshold },
        { label: "Executed Mult", value: isBusted ? "Bust" : `${bet.multiplier.toFixed(2)}x` },
        { label: "Network Dropped", value: bet.is_disconnected ? "TRUE" : "FALSE" }
      ],
    };
  });

  return {
    gameType,
    header: {
      roundId,
      playerId,
      gameId,
      gameCrashedAt,
    },
    sections,
  };
}