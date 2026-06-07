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
  const gameCrashedAt = stateIndicator ? (Number(stateIndicator) / 100).toFixed(2) + "x" : "BUST";

  // Extraction rules derived directly from HighflyerGameResult UI logic
  const totalPayout = roundDetails?.tptInfo?.find(
    (item: any) => item.action_type?.toLowerCase() === "settled"
  )?.amount ?? 0;

  const totalBet = roundDetails?.tptInfo?.find(
    (item: any) => item.action_type?.toLowerCase() === "placed"
  )?.amount ?? 0;

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
    // 1. Unified function evaluation logic mapped to UI numbers
    const typeOfCashout = (
      auto_cashout_requested: null | number,
      manual_cashout_requested: null | number,
      forced_cashout_requested: null | number
    ) => {
      if (auto_cashout_requested !== null) return 1;
      if (manual_cashout_requested !== null) return 2;
      if (forced_cashout_requested !== null) return 3;
      return 0;
    };

    const getReadableCashoutType = (id: number) => {
      if (id === 1) return "Auto Cashout";
      if (id === 2) return "Manual Cashout";
      if (id === 3) return "Forced Cashout";
      return "No Cashout";
    };

    const getRequestedCashoutAmount = (id: number) => {
      if (id === 1) return bet.auto_cash_out;
      if (id === 2) return bet.requested_cash_out;
      if (id === 3) return bet.force_cash_out;
      return -1;
    };

    const id_typeOfCashout = typeOfCashout(bet.auto_cash_out, bet.requested_cash_out, bet.force_cash_out);
    const cashOutType = getReadableCashoutType(id_typeOfCashout);
    const requestedCashoutAmount = getRequestedCashoutAmount(id_typeOfCashout);

    const bet_amount = bet.bet_amount ?? 0;
    const multiplierLabel = bet.multiplier > 0 ? `${bet.multiplier}x` : '-';
    const isBusted = id_typeOfCashout === 0;

    return {
      title: `SPOT POSITION #0${index + 1}`,
      subtitle: `Bet ID: ${bet.bet_id || "—"}`,
      wager: bet_amount,
      payout: requestedCashoutAmount, // Matches payoutReceived fallback logic
      status: {
        label: cashOutType.toUpperCase(),
        variant: isBusted ? ("danger" as const) : ("success" as const),
      },
      metrics: [
        { label: "Executed Mult", value: multiplierLabel },
        { label: "Network Dropped", value: bet.is_disconnected ? "TRUE" : "FALSE" }
      ],
      // Retaining explicit timestamps for audit-trail logging requirements
      sequenceLogs: {
        committed: bet.created_time,
        autoInit: bet.auto_cash_out_initiated_time,
        reqInit: bet.requested_cash_out_initiated_time,
        forceOverride: bet.force_cash_out_initiated_time,
        disconnectedTime: bet.disconnected_time
      }
    };
  });

  return {
    gameType,
    header: {
      roundId,
      playerId,
      gameId,
      gameCrashedAt,
      totalBet,
      totalPayout
    },
    sections,
  };
}