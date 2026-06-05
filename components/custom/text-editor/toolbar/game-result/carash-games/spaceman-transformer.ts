"use client";

import { CrashGameBetArraySchema } from "@/features/round-details/types/crash-games";
import { getGameType } from "@/utils/get-game-type";

interface SpacemanTransformerProps {
  roundDetails: any;
}

const parseCashoutTypeName = (typeString: string | null) => {
  if (!typeString) return "Not Settled";
  const normalized = typeString.trim().toUpperCase();
  if (normalized === "OD") return "On Demand Cashout";
  if (normalized === "AU") return "Auto Cashout";
  return typeString;
};

export function transformSpacemanToConfig({ roundDetails }: SpacemanTransformerProps) {
  const rawGameType = roundDetails?.gameDetails?.at(0)?.game_type || "";
  const gameType = getGameType(rawGameType.toLowerCase()) || "spaceman"; 

  const roundId = String(roundDetails?.tptInfo?.at(0)?.round_id || "N/A");
  const stateIndicator = roundDetails?.gameDetails?.[0]?.state_indicator;
  const gameCrashedAt = stateIndicator ? (Number(stateIndicator) / 100).toFixed(2) : "BUST";

  if (!Array.isArray(roundDetails?.crashGamesData) || roundDetails.crashGamesData.length === 0) {
    return null;
  }

  // Sanitize the raw data elements inline to match your strict Zod schema types
  const sanitizedCrashData = roundDetails.crashGamesData.map((bet: any) => {
    let cleanDisconnected = false;
    if (bet.Disconnected !== undefined && bet.Disconnected !== null) {
      const norm = String(bet.Disconnected).trim().toLowerCase();
      cleanDisconnected = norm === "true" || norm === "1";
    }
    return {
      ...bet,
      Disconnected: cleanDisconnected,
    };
  });

  const result = CrashGameBetArraySchema.safeParse(sanitizedCrashData);
  
  if (!result.success) {
    console.error(
      "❌ Schema parsing failed for Spaceman/Core Crash payload matrix:",
      JSON.stringify(result.error.flatten().fieldErrors, null, 2)
    );
    return null;
  }

  const validBets = result.data;

  const sections = validBets.map((bet, index) => {
    // --- 1. CORE DATA RESOLUTION (HYBRID KEYS) ---
    const wageredAmount = bet.betAmount;
    const mainMultiplier = bet.multiplier;
    
    const isMainBusted = mainMultiplier === -1 || mainMultiplier <= 0;
    const isHalfBusted = bet.HC_MUL === -1 || bet.HC_MUL <= 0;
    const isCompleteBusted = bet.CO_MUL === -1 || bet.CO_MUL <= 0;

    // --- 2. MULTIPLIER CONFIGURATIONS ---
    const halfTargetConfig = bet.halfmultiplier && bet.halfmultiplier !== -1 
      ? Number(bet.halfmultiplier).toFixed(2) 
      : (bet.HC_Requested ? Number(bet.HC_Requested).toFixed(2) : null);
    
    const rawFullTarget = bet.requestedCashout ?? bet.processedCashout;
    const fullTargetConfig = rawFullTarget && rawFullTarget !== -1 ? Number(rawFullTarget).toFixed(2) : null;

    // --- 3. PAYOUT RESOLUTION ---
    const explicitHalfPayout = bet.HC_CashPayOut ?? 0;
    const explicitCompletePayout = bet.FC_CashPayOut ?? 0;
    const totalPayout = explicitHalfPayout + explicitCompletePayout;

    // --- 4. EXECUTED CASHOUT SCHEME TYPE ---
    let cashOutTypeDisplay = parseCashoutTypeName(bet.CO_TYPE);
    if (cashOutTypeDisplay === "Not Settled") {
      if (isCompleteBusted) cashOutTypeDisplay = "Bust / Lost";
      else if (!isCompleteBusted) cashOutTypeDisplay = "Complete Cashout";
    }

    // --- 5. DISCONNECTION SAFEGUARD ---
    const isDisconnected = bet.Disconnected === true;

    // --- 6. CONDITIONAL UNION HIGHLIGHTING ---
    let statusVariant: "success" | "danger" | "warning" = "success";
    if (isMainBusted && isHalfBusted && isCompleteBusted) {
      statusVariant = "danger";
    } else if (isCompleteBusted && !isHalfBusted) {
      statusVariant = "warning";
    }

    return {
      bet_id: bet.bet_id || "—",
      userId: bet.userId,
      gameId: bet.gameId,
      wageredAmount,
      totalPayout,
      cashOutTypeDisplay: cashOutTypeDisplay.toUpperCase(),
      statusVariant,
      isBustedLabel: isMainBusted && isHalfBusted && isCompleteBusted ? "ROUND BUSTED" : "CASHOUT ACTIVITY RECORDED",
      
      // Explicit Half Cashout Payload Group
      hc: {
        typeName: parseCashoutTypeName(bet.HC_TYPE).toUpperCase(),
        target: halfTargetConfig ? `${halfTargetConfig}x` : "—",
        allocation: bet.HC_BetAmount,
        multiplier: isHalfBusted ? "Bust" : `${bet.HC_MUL.toFixed(2)}x`,
        payout: explicitHalfPayout,
        requested: bet.HC_Requested ? `${bet.HC_Requested}x` : "No",
        requestTime: (bet as any).HC_RequestTime || "—",
        settleTime: (bet as any).HC_SettleTime || "—",
        isBusted: isHalfBusted
      },

      // Explicit Full/Complete Cashout Payload Group
      co: {
        typeName: cashOutTypeDisplay.toUpperCase(),
        target: fullTargetConfig ? `${fullTargetConfig}x` : "—",
        allocation: bet.FC_BetAmount,
        multiplier: isCompleteBusted ? "Bust" : `${bet.CO_MUL.toFixed(2)}x`,
        payout: explicitCompletePayout,
        requested: (bet as any).FC_Requested ? `${(bet as any).FC_Requested}x` : "No",
        requestTime: (bet as any).FC_RequestTime || "—",
        settleTime: (bet as any).FC_SettleTime || "—",
        isBusted: isCompleteBusted
      },

      // Diagnostics Meta Specifications
      meta: {
        createdOn: bet.createdOn,
        ck: bet.ck,
        updatedOn: (bet as any).Updated_on || "—",
        processedCashout: bet.processedCashout || "—",
        isDisconnected: isDisconnected ? "Yes" : "No"
      }
    };
  });

  return {
    gameType,
    header: {
      roundId,
      gameCrashedAt
    },
    sections
  };
}