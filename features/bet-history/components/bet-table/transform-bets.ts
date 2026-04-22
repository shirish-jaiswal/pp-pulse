export type RoundRow = {
  roundId: string;
  gameId: string;
  totalPlaced: number;
  totalSettled: number;
  profitLoss: number;
  status: "WIN" | "LOSS" | "BREAKEVEN";

  time: string;
  errorCode: string | null;
  errorDescription: string | null;
  retryCounter: number;
  gameMode: string;
};

export function transformToRounds(data: any[]): RoundRow[] {
  const grouped = new Map<string, any>();

  data.forEach((item) => {
    const key = item.RoundId;

    if (!grouped.has(key)) {
      grouped.set(key, {
        roundId: item.RoundId,
        gameId: item.GameId?.trim(),
        totalPlaced: 0,
        totalSettled: 0,
        latest: item,
      });
    }

    const group = grouped.get(key);

    if (item.ActionType === "Placed") {
      group.totalPlaced += item.Amount;
    }

    if (item.ActionType === "Settled") {
      group.totalSettled += item.Amount;
    }

    // track latest transaction
    if (new Date(item.Time) > new Date(group.latest.Time)) {
      group.latest = item;
    }
  });

  return Array.from(grouped.values()).map((g) => {
    const profitLoss = g.totalSettled - g.totalPlaced;

    let status: RoundRow["status"] = "BREAKEVEN";
    if (profitLoss > 0) status = "WIN";
    else if (profitLoss < 0) status = "LOSS";
    console.log("g", g);
    return {
      roundId: g.roundId,
      gameId: g.gameId,
      totalPlaced: g.totalPlaced,
      totalSettled: g.totalSettled,
      profitLoss,
      status,
      time: g.latest.Time,
      errorCode: g.latest.ErrorCode,
      errorDescription: g.latest.ErrorDescription,
      retryCounter: g.latest.RetryCounter,
      gameMode: g.latest.GameMode,
    };
  });
}