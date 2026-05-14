import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { text } from "stream/consumers";

export type EngineState = {
  triggers: Record<string, any>;
};

export const IMAGE_MAP: Record<string, string> = {
  candy_drop: "/portal/sweet-bonanza/sb_cd.png",
  sweet_spin: "/portal/sweet-bonanza/sb_ss.png",
  bubble_surprise: "/portal/sweet-bonanza/sb_bs.png",
  "1x": "/portal/sweet-bonanza/sb_1x.png",
  "2x": "/portal/sweet-bonanza/sb_2x.png",
  "5x": "/portal/sweet-bonanza/sb_5x.png",
};

export const processGameDetails = (gameDetails: any[]) => {
  const state: EngineState = { triggers: {} };
  const bonusResults: any[] = [];
  const multipliers: any[] = [];

  // Sort by time to ensure triggers are processed before results
  const sortedDetails = [...gameDetails].sort(
    (a, b) => new Date(a.result_time).getTime() - new Date(b.result_time).getTime()
  );

  for (const item of sortedDetails) {
    const rawDesc = item.Description?.toString() || "";
    const lowerDesc = rawDesc.toLowerCase();

    // --- 1. NUMBER BETS (1, 2, 5 -> 1x, 2x, 5x) ---
    // If description is just a number, map it to the "x" image key
    const numValue = Number(rawDesc.trim());
    if (!isNaN(numValue) && rawDesc.trim() !== "" && numValue <= 10) {
      multipliers.push({
        ...item,
        imageKey: `${numValue}x`,
        displayName: `${numValue}x`,
        value: item.multiplier || numValue
      });
      continue;
    }

    // --- 2. SWEET SPINS RULE ---
    if (lowerDesc.includes("sweet spins")) {
      const type = "sweet_spin";
      if (!state.triggers[type]) state.triggers[type] = { ...item, bonusType: type };

      const isAdditional = bonusResults.some(r => r.bonusType === type);
      bonusResults.push({
        ...item,
        bonusType: type,
        isAdditional,
        displayName: isAdditional ? "+ Sweet Spin" : "Sweet Spins",
        imageKey: type,
        displayMultiplier: `${item.multiplier}x`
      });
      continue;
    }

    // --- 3. CANDY DROP RULE (CandyBall 0, 1, 2) ---
    if (lowerDesc.includes("candy")) {
      const type = "candy_drop";

      // Store the main "Candy Drop" trigger
      if (lowerDesc === "candy drop" && !state.triggers[type]) {
        state.triggers[type] = { ...item, bonusType: type };
      }

      if (lowerDesc.includes("candyball")) {
        const match = rawDesc.match(/candyball\s*(\d)/i);
        const num = match ? Number(match[1]) : null;

        const colorMap: Record<number, string> = { 0: "Blue", 1: "Red", 2: "Yellow" };

        bonusResults.push({
          ...item,
          bonusType: type,
          displayName: `Candy Drop (${colorMap[num!] || 'Result'})`,
          imageKey: type,
          candy: {
            number: num,
            color: num !== null ? colorMap[num] : null,
            multiplier: item.multiplier
          }
        });
      }
      continue;
    }

    if (lowerDesc.includes("bubble surprise")) {
      const type = "bubble_surprise";
      if (!state.triggers[type]) state.triggers[type] = { ...item, bonusType: type };

      bonusResults.push({
        ...item,
        bonusType: type,
        displayName: "Bubble Surprise",
        imageKey: type,
        displayMultiplier: `${item.multiplier}x`
      });
      continue;
    }
  }

  return { triggers: state.triggers, bonusResults, multipliers };
};

export function sb_floatResult(gameDetails: any[]) {
  const data = processGameDetails(gameDetails || []);
  if( data.bonusResults.length !== 0) {
    return data.bonusResults[0].imageKey ? IMAGE_MAP[data.bonusResults[0].imageKey] : undefined;
  } else if (data.multipliers.length !== 0) {
    return data.multipliers[0].imageKey ? IMAGE_MAP[data.multipliers[0].imageKey] : undefined;
  } else {
    return undefined;
  }
}