import { evaluateBaccaratHands, getPerfectBaccaratHand } from "./baccarat-utils";
import { PayoutRow, ParsedBet, CalculationDetail, CalculationResult, GameStrategy, Rank, Suit } from "./types";
export const baccaratStrategy: GameStrategy = {
  calculate: (selectedResultBc: string, payouts: PayoutRow[], parsedBets: ParsedBet[], context) => {
    const mainWinningRule = payouts.find((p) => String(p.bet_codes).trim() === String(selectedResultBc).trim());
    if (!mainWinningRule) return null;

    // 1. Force recalculation using rule-normalized hands
    const { playerFinal, bankerFinal } = getPerfectBaccaratHand(
      context?.playerCards || [],
      context?.bankerCards || []
    );
    
    // 2. Evaluate the hand matrix
    const telemetry = evaluateBaccaratHands(playerFinal, bankerFinal);
    // telemetry should return fields like: 
    // { calculatedBetCodes: string[], natural: boolean, pointDifference: number, winner: 'player' | 'banker' | 'tie' }
    
    const allWinningCodes = new Set([
      String(selectedResultBc).trim(),
      ...telemetry.calculatedBetCodes.map(code => String(code).trim())
    ]);

    let totalWager = 0;
    let totalPayout = 0;

    const details: CalculationDetail[] = parsedBets.map((bet) => {
      const normalizedBc = String(bet.bc).trim();
      const isWinner = allWinningCodes.has(normalizedBc);
      let winAmount = 0;

      totalWager += bet.amt;

      if (isWinner) {
        const currentRule = payouts.find((p) => String(p.bet_codes).trim() === normalizedBc);
        
        if (currentRule) {
          let multiplier = 0;
          const payoutStr = currentRule.payout.toLowerCase().trim();

          // --- ADAPTIVE MULTIPLIER ENGINE FOR COMPLEX SIDE-BETS ---

          // Case A: Is a simple Push condition
          if (payoutStr === "push") {
            winAmount = bet.amt;
          } 
          // Case B: Player / Banker Bonus (Variable payouts based on margin)
          else if (payoutStr.includes("variable")) {
            if (telemetry.natural) {
              multiplier = 1; // Naturals typically pay 1:1 on bonus structures
            } else {
              // Standard non-natural margin scaling hierarchy
              const margin = telemetry.pointDifference;
              if (margin === 9) multiplier = 30;
              else if (margin === 8) multiplier = 10;
              else if (margin === 7) multiplier = 6;
              else if (margin === 6) multiplier = 4;
              else if (margin === 5) multiplier = 2;
              else if (margin === 4) multiplier = 1;
              else multiplier = 0; // Margin <= 3 pays nothing even if side won
            }
            winAmount = multiplier > 0 ? (bet.amt * multiplier) + bet.amt : 0;
          } 
          // Case C: Dual Split Multipliers (Fortune 6 / Super 8 / Super 6)
          else if (payoutStr.includes("/")) {
            // Example layout format parsing: "12:1 / 20:1"
            const parts = payoutStr.split("/").map(p => p.trim());
            const totalCardsInPlay = playerFinal.length + bankerFinal.length;
            
            // Look up exact conditions (e.g., Fortune 6 pays 20:1 on 3rdrd card wins, else 12:1)
            if (normalizedBc === "25") { // Fortune 6
              const selectedPayout = (bankerFinal.length === 3) ? parts[1] : parts[0];
              const [num, den] = selectedPayout.split(":").map(Number);
              multiplier = den ? num / den : num;
            } else if (normalizedBc === "20") { // Super 8
              const selectedPayout = (totalCardsInPlay === 6) ? parts[1] : parts[0];
              const [num, den] = selectedPayout.split(":").map(Number);
              multiplier = den ? num / den : num;
            } else if (normalizedBc === "5") { // Super 6 (No Commission variation)
              const selectedPayout = (bankerFinal.length === 3) ? parts[1] : parts[0];
              const [num, den] = selectedPayout.split(":").map(Number);
              multiplier = den ? num / den : num;
            }
            winAmount = (bet.amt * multiplier) + bet.amt;
          } 
          // Case D: Standard Fractional Ratios ("11:1", "0.54:1")
          else {
            if (payoutStr.includes(":")) {
              const [num, den] = payoutStr.split(":").map(Number);
              multiplier = den ? num / den : num;
            } else {
              multiplier = parseFloat(payoutStr) || 0;
            }
            winAmount = (bet.amt * multiplier) + bet.amt;
          }
        }
      }

      totalPayout += winAmount;
      const placementInfo = payouts.find((p) => String(p.bet_codes).trim() === normalizedBc);

      return {
        betCode: bet.bc,
        betDescription: placementInfo ? placementInfo.description : "Unknown Option",
        amountPlaced: bet.amt,
        isWinner,
        winAmount,
      };
    });

    return {
      totalWager,
      totalPayout,
      winningDescription: mainWinningRule.description,
      winningRatio: mainWinningRule.payout,
      details,
    };
  }
};

const rouletteStrategy: GameStrategy = {
  calculate: (selectedResultBc: string, payouts: PayoutRow[], parsedBets: ParsedBet[]) => {
    const winningPayoutRule = payouts.find((p) => String(p.bet_codes).trim() === String(selectedResultBc).trim());
    if (!winningPayoutRule) return null;

    const [numerator, denominator] = winningPayoutRule.payout.split(":").map(Number);
    const multiplier = denominator ? numerator / denominator : numerator;

    let totalWager = 0;
    let totalPayout = 0;

    const details: CalculationDetail[] = parsedBets.map((bet) => {
      const isWinner = String(bet.bc).trim() === String(selectedResultBc).trim();
      const winAmount = isWinner ? (bet.amt * multiplier) + bet.amt : 0;

      totalWager += bet.amt;
      totalPayout += winAmount;

      const placementInfo = payouts.find((p) => String(p.bet_codes).trim() === String(bet.bc).trim());

      return {
        betCode: bet.bc,
        betDescription: placementInfo ? placementInfo.description : "Unknown Option",
        amountPlaced: bet.amt,
        isWinner,
        winAmount,
      };
    });

    return {
      totalWager,
      totalPayout,
      winningDescription: winningPayoutRule.description,
      winningRatio: winningPayoutRule.payout,
      details,
    };
  }
};

export function getGameStrategy(tableName: string): GameStrategy {
  return tableName.toLowerCase().includes("baccarat") ? baccaratStrategy : rouletteStrategy;
}