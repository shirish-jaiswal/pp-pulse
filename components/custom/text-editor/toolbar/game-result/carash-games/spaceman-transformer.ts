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

const normalizeToIsoString = (val: any) => {
  if (!val || String(val).trim() === "" || String(val).trim() === "—") {
    return new Date(0).toISOString();
  }
  if (typeof val === "number") return new Date(val).toISOString();
  
  const trimmed = String(val).trim();
  if (!trimmed.includes("T") && trimmed.includes(" ")) {
    return new Date(trimmed.replace(" ", "T") + "Z").toISOString();
  }
  
  try {
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
  } catch {
    return new Date(0).toISOString();
  }
};

const displayFormattedDate = (isoString: string | null | undefined) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (d.getTime() === 0) return "—";
  return d.toUTCString();
};

export function transformSpacemanToConfig({ roundDetails }: SpacemanTransformerProps) {
  const rawGameType = roundDetails?.gameDetails?.at(0)?.game_type || "";
  const gameType = getGameType(rawGameType.toLowerCase()) || "spaceman"; 

  const roundId = String(roundDetails?.tptInfo?.at(0)?.round_id || "N/A");
  const stateIndicator = roundDetails?.gameDetails?.[0]?.state_indicator;
  const gameCrashedAt = stateIndicator ? (Number(stateIndicator) / 100).toFixed(2) : null;

  if (!Array.isArray(roundDetails?.crashGamesData) || roundDetails.crashGamesData.length === 0) {
    return null;
  }

  const sanitizedCrashData = roundDetails.crashGamesData.map((bet: any) => {
    let cleanDisconnected = false;
    if (bet.Disconnected !== undefined && bet.Disconnected !== null) {
      const norm = String(bet.Disconnected).trim().toLowerCase();
      cleanDisconnected = norm === "true" || norm === "1";
    }

    return {
      ...bet,
      Disconnected: cleanDisconnected,
      bet_id: bet.bet_id ? String(bet.bet_id).trim() : "",
      gameId: String(bet.gameId ?? bet.game_id ?? "N/A").trim(),
      userId: String(bet.userId ?? bet.user_id ?? "N/A").trim(),
      HC_TYPE: bet.HC_TYPE ? String(bet.HC_TYPE).trim() : "",
      CO_TYPE: bet.CO_TYPE ? String(bet.CO_TYPE).trim() : "",
      HC_RequestTime: normalizeToIsoString(bet.HC_RequestTime),
      HC_SettleTime: normalizeToIsoString(bet.HC_SettleTime),
      FC_RequestTime: normalizeToIsoString(bet.FC_RequestTime),
      FC_SettleTime: normalizeToIsoString(bet.FC_SettleTime),
      createdOn: normalizeToIsoString(bet.createdOn || bet.created_time),
      ck: normalizeToIsoString(bet.ck),
    };
  });

  const result = CrashGameBetArraySchema.safeParse(sanitizedCrashData);
  
  if (!result.success) {
    console.error(
      "❌ Schema parsing failed for Spaceman payload matrix trace:",
      JSON.stringify(result.error.errors, null, 2)
    );
    return null;
  }

  const validBets = result.data;
  const currency = (roundDetails?.tptInfo?.[0]?.currency_code || "") as string;

  const sections = validBets.map((validatedBet, index) => {
    const bet = sanitizedCrashData[index];

    // Formatted multi-placement checks matching the original UI naming
    const full_cashout_opted_enabled = validatedBet.multiplier > 0 ? validatedBet.multiplier + 'x' : '-';
    const half_cashout_opted_enabled = validatedBet.halfmultiplier > 0 ? validatedBet.halfmultiplier + 'x' : '-';

    const full_cashout_executed_at = bet.CO_MUL > 0 ? bet.CO_MUL + 'x' : '-';
    const half_cashout_executed_at = bet.HC_MUL > 0 ? bet.HC_MUL + 'x' : '-';

    const half_cashout_requested_at = bet.HC_Requested ? bet.HC_Requested + 'x' : '-';
    const full_cashout_requested_at = bet.FC_Requested ? bet.FC_Requested + 'x' : '-';

    const explicitHalfPayout = bet.HC_CashPayOut ?? 0;
    const explicitCompletePayout = bet.FC_CashPayOut ?? 0;
    const totalPayout = explicitHalfPayout + explicitCompletePayout;

    const isCompleteBusted = bet.CO_MUL === -1 || Number(bet.CO_MUL || 0) <= 0;
    const isHalfBusted = bet.HC_MUL === -1 || Number(bet.HC_MUL || 0) <= 0;

    // Retain exact variant checks matching layout coloring
    let statusVariant: "success" | "danger" | "warning" = "success";
    if (isCompleteBusted && isHalfBusted) {
      statusVariant = "danger";
    } else if (isCompleteBusted && !isHalfBusted) {
      statusVariant = "warning";
    }

    return {
      bet_id: validatedBet.bet_id || bet.bet_id || "—",
      userId: validatedBet.userId || bet.userId || "—",
      gameId: validatedBet.gameId || bet.gameId || "—",
      currency,
      wageredAmount: validatedBet.betAmount,
      totalPayout,
      full_cashout_opted_enabled,
      half_cashout_opted_enabled,
      statusVariant,
      isBustedLabel: isCompleteBusted && isHalfBusted ? "ROUND BUSTED" : "CASHOUT ACTIVITY RECORDED",
      hc: {
        typeName: parseCashoutTypeName(bet.HC_TYPE),
        optedAt: half_cashout_opted_enabled,
        target: half_cashout_requested_at,
        allocation: bet.HC_BetAmount ?? 0,
        multiplier: half_cashout_executed_at,
        payout: explicitHalfPayout,
        requested: half_cashout_requested_at,
        requestTime: displayFormattedDate(validatedBet.HC_RequestTime),
        settleTime: displayFormattedDate(validatedBet.HC_SettleTime),
        isBusted: isHalfBusted
      },
      co: {
        typeName: parseCashoutTypeName(bet.CO_TYPE),
        optedAt: full_cashout_opted_enabled,
        target: full_cashout_requested_at,
        allocation: bet.FC_BetAmount ?? 0,
        multiplier: full_cashout_executed_at,
        payout: explicitCompletePayout,
        requested: full_cashout_requested_at,
        requestTime: displayFormattedDate(validatedBet.FC_RequestTime),
        settleTime: displayFormattedDate(validatedBet.FC_SettleTime),
        isBusted: isCompleteBusted
      },
      meta: {
        createdOn: displayFormattedDate(validatedBet.createdOn),
        ck: displayFormattedDate(validatedBet.ck),
        updatedOn: bet.Updated_on && normalizeToIsoString(bet.Updated_on) !== new Date(0).toISOString() 
          ? displayFormattedDate(normalizeToIsoString(bet.Updated_on)) 
          : "—",
        processedCashout: validatedBet.processedCashout || "—",
        isDisconnected: validatedBet.Disconnected
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