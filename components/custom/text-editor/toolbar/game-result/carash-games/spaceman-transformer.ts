"use client";

import { CrashGameBetArraySchema } from "@/features/round-details/types/crash-games";
import { getGameType } from "@/utils/get-game-type";

interface SpacemanTransformerProps {
  roundDetails: any;
}

const parseCashoutTypeName = (typeString: string | null) => {
  if (!typeString || typeString.trim() === "") return "Not Settled";
  const normalized = typeString.trim().toUpperCase();
  if (normalized === "OD") return "On Demand Cashout";
  if (normalized === "AU") return "Auto Cashout";
  return typeString;
};

// Formats messy timestamps to rigid, strict ISO strings to appease strict schema .datetime() rules
const normalizeToIsoString = (val: any) => {
  // Return the epoch representation as an implicit schema-safe token for missing values
  if (!val || String(val).trim() === "" || String(val).trim() === "—") {
    return new Date(0).toISOString(); // "1970-01-01T00:00:00.000Z"
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

// Decodes mock epoch datetimes back into clean textual empty row markers
const displayFormattedDate = (isoString: string | null | undefined) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (d.getTime() === 0) return "—"; // Matches epoch fallback token
  return d.toUTCString();
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

  // Deep sanitization loop forcing rigid data compliance across all array slots
  const sanitizedCrashData = roundDetails.crashGamesData.map((bet: any) => {
    let cleanDisconnected = false;
    if (bet.Disconnected !== undefined && bet.Disconnected !== null) {
      const norm = String(bet.Disconnected).trim().toLowerCase();
      cleanDisconnected = norm === "true" || norm === "1";
    }

    return {
      ...bet,
      Disconnected: cleanDisconnected,

      // Non-nullable string fields mapped out safely
      bet_id: bet.bet_id ? String(bet.bet_id).trim() : "",
      gameId: String(bet.gameId ?? bet.game_id ?? "N/A").trim(),
      userId: String(bet.userId ?? bet.user_id ?? "N/A").trim(),

      // Nullable string structures
      HC_TYPE: bet.HC_TYPE ? String(bet.HC_TYPE).trim() : "",
      CO_TYPE: bet.CO_TYPE ? String(bet.CO_TYPE).trim() : "",

      // Force epoch formatting tokens onto empty values to pass schema rules cleanly
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
      "❌ Schema parsing failed for Spaceman/Core Crash payload matrix detailed trace:",
      JSON.stringify(result.error.errors, null, 2)
    );
    return null;
  }

  const validBets = result.data;

  const sections = validBets.map((validatedBet, index) => {
    const bet = sanitizedCrashData[index];

    // --- 1. CORE DATA RESOLUTION (HYBRID KEYS) ---
    const wageredAmount = validatedBet.betAmount;
    const mainMultiplier = validatedBet.multiplier;
    
    const isMainBusted = mainMultiplier === -1 || mainMultiplier <= 0;
    const isHalfBusted = bet.HC_MUL === -1 || bet.HC_MUL <= 0;
    const isCompleteBusted = bet.CO_MUL === -1 || bet.CO_MUL <= 0;

    // --- 2. MULTIPLIER CONFIGURATIONS ---
    const halfTargetConfig = validatedBet.halfmultiplier && validatedBet.halfmultiplier !== -1 
      ? Number(validatedBet.halfmultiplier).toFixed(2) 
      : (bet.HC_Requested ? Number(bet.HC_Requested).toFixed(2) : null);
    
    const rawFullTarget = validatedBet.requestedCashout ?? validatedBet.processedCashout;
    const fullTargetConfig = rawFullTarget && rawFullTarget !== -1 ? Number(rawFullTarget).toFixed(2) : null;

    // --- 3. PAYOUT RESOLUTION ---
    const explicitHalfPayout = bet.HC_CashPayOut ?? 0;
    const explicitCompletePayout = bet.FC_CashPayOut ?? 0;
    const totalPayout = explicitHalfPayout + explicitCompletePayout;

    // --- 4. EXECUTED CASHOUT SCHEME TYPE ---
    let cashOutTypeDisplay = parseCashoutTypeName(validatedBet.CO_TYPE);
    if (cashOutTypeDisplay === "Not Settled" || cashOutTypeDisplay === "") {
      if (isCompleteBusted) cashOutTypeDisplay = "Bust / Lost";
      else if (!isCompleteBusted) cashOutTypeDisplay = "Complete Cashout";
    }

    // --- 5. DISCONNECTION SAFEGUARD ---
    const isDisconnected = validatedBet.Disconnected === true;

    // --- 6. CONDITIONAL UNION HIGHLIGHTING ---
    let statusVariant: "success" | "danger" | "warning" = "success";
    if (isMainBusted && isHalfBusted && isCompleteBusted) {
      statusVariant = "danger";
    } else if (isCompleteBusted && !isHalfBusted) {
      statusVariant = "warning";
    }

    return {
      bet_id: validatedBet.bet_id || "—",
      userId: validatedBet.userId || "—",
      gameId: validatedBet.gameId || "—",
      wageredAmount,
      totalPayout,
      cashOutTypeDisplay: cashOutTypeDisplay.toUpperCase(),
      statusVariant,
      isBustedLabel: isMainBusted && isHalfBusted && isCompleteBusted ? "ROUND BUSTED" : "CASHOUT ACTIVITY RECORDED",
      
      hc: {
        typeName: parseCashoutTypeName(bet.HC_TYPE).toUpperCase(),
        target: halfTargetConfig ? `${halfTargetConfig}x` : "—",
        allocation: bet.HC_BetAmount ?? 0,
        multiplier: isHalfBusted ? "Bust" : `${Number(bet.HC_MUL || 0).toFixed(2)}x`,
        payout: explicitHalfPayout,
        requested: bet.HC_Requested ? `${bet.HC_Requested}x` : "No",
        requestTime: displayFormattedDate(validatedBet.HC_RequestTime),
        settleTime: displayFormattedDate(validatedBet.HC_SettleTime),
        isBusted: isHalfBusted
      },
      co: {
        typeName: cashOutTypeDisplay.toUpperCase(),
        target: fullTargetConfig ? `${fullTargetConfig}x` : "—",
        allocation: bet.FC_BetAmount ?? 0,
        multiplier: isCompleteBusted ? "Bust" : `${Number(bet.CO_MUL || 0).toFixed(2)}x`,
        payout: explicitCompletePayout,
        requested: bet.FC_Requested ? `${bet.FC_Requested}x` : "No",
        requestTime: displayFormattedDate(validatedBet.FC_RequestTime),
        settleTime: displayFormattedDate(validatedBet.FC_SettleTime),
        isBusted: isCompleteBusted
      },
      meta: {
        createdOn: displayFormattedDate(validatedBet.createdOn),
        ck: displayFormattedDate(validatedBet.ck),
        updatedOn: bet.Updated_on && normalizeToIsoString(bet.Updated_on) !== new Date(0).toISOString() ? new Date(bet.Updated_on).toUTCString() : "—",
        processedCashout: validatedBet.processedCashout || "—",
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