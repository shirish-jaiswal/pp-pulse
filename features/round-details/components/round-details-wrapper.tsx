"use client";

import { RoundDetailsProvider } from "@/features/round-details/context/round-details-context";
import { RoundInvestigator } from "@/features/round-details/components/round-investigator";
import RoundOverview from "@/features/round-details/components/round-overview/round-overview";
import GameMetadata from "@/features/round-details/components/round-overview/game-metadata";
import RoundAudit from "@/features/round-details/components/round-audit/round-audit";
import { MiniPlayingCard, Rank, Suit } from "@/components/custom/games/playing-card";
import { ResolutionEditor } from "@/features/round-details/components/resolution-sheet/resolution-editor";
import { ProfessionalRoulette } from "@/components/custom/games/roulette-table";

export function RoundDetailsWrapper() {
    // Dummy data representing a single game round lifecycle
    const dummyRoundData = {
        roundId: "PP-PULSE-99283-X",
        transactions: [
            {
                "transId": "1686391076955389952",
                "operatorTransId": "560354002725601",
                "ppSlotsTransId": "1113469be35255d73b70a683fb045;1340015120962",
                "transDate": "2026-03-21 06:05:25.187",
                "transType": "Bet Placed",
                "transStatus": "Success",
                "error": "0(Ok)",
                "transCur": "TRY",
                "transAmt": "100.00",
                "retryCount": "0"
            },
            {
                "transId": "1686391076962353152",
                "operatorTransId": "560354002725602",
                "ppSlotsTransId": "1113469be35250fe6b37e25038ed0;134001512096624",
                "transDate": "2026-03-21 06:05:25.610",
                "transType": "Bet Placed",
                "transStatus": "Success",
                "error": "0(Ok)",
                "transCur": "TRY",
                "transAmt": "100.00",
                "retryCount": "0"
            },
            {
                "transId": "1686391077360402432",
                "operatorTransId": "null",
                "ppSlotsTransId": "null",
                "transDate": "2026-03-21 06:05:49.907",
                "transType": "Unknown",
                "transStatus": "Success",
                "error": "No Error",
                "transCur": "TRY",
                "transAmt": "100.00",
                "retryCount": "0"
            },
            {
                "transId": "1686391077546491907",
                "operatorTransId": "560354002761668",
                "ppSlotsTransId": "1113469be35490fe6b37e25038efd;134001512096656",
                "transDate": "2026-03-21 06:06:01.263",
                "transType": "Bet Settled",
                "transStatus": "Success",
                "error": "0(Ok)",
                "transCur": "TRY",
                "transAmt": "500.00",
                "retryCount": "0"
            }
        ],
        bets: [
            {
                betCode: "Bet behind Play seat 3",
                betInitiatedOn: "2026-03-21 06:05:18",
                bettingTime: "2026-03-21 06:05:25",
                settlementTime: "2026-03-21 06:06:01",
                betAmount: "100.0000",
                winAmount: "200.0000",
                betStatus: "Settled"
            },
            {
                betCode: "Bet behind Play seat 4",
                betInitiatedOn: "2026-03-21 06:05:18",
                bettingTime: "2026-03-21 06:05:25",
                settlementTime: "2026-03-21 06:06:01",
                betAmount: "100.0000",
                winAmount: "200.0000",
                betStatus: "Settled"
            },
            {
                betCode: "Bet Behind Free Double seat 3",
                betInitiatedOn: "2026-03-21 06:05:49",
                bettingTime: "2026-03-21 06:05:49",
                settlementTime: "2026-03-21 06:06:01",
                betAmount: "100.0000",
                winAmount: "100.0000",
                betStatus: "Settled"
            }
        ],
        progression: [
            { step: "Round Initialized", time: "11:34:01" },
            { step: "Bets Locked", time: "11:34:15" },
            { step: "Result Generated", time: "11:34:40" },
        ],
        promos: [
            { label: "Welcome Multiplier", value: "2x Boost" }
        ],
        logs: [
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
            { level: "INFO", message: "Payload received from client", origin: "gateway" },
            { level: "DEBUG", message: "Calculating RNG seed for round", origin: "engine" },
            { level: "INFO", message: "Transaction broadcasted to ledger", origin: "wallet-service" },
        ]
    };

    const evaluateBet = (betCode: string, amount: number, winNum: number) => {
        // 1. Handle Inside Bets (Numbers)
        const numbers = betCode.split('-').filter(p => !isNaN(Number(p))).map(Number);

        if (numbers.length > 0) {
            const isWin = numbers.includes(winNum);
            // Standard Payouts: 1:35, 2:17, 3:11, 4:8, 6:5
            const multipliers: Record<number, number> = { 1: 35, 2: 17, 3: 11, 4: 8, 6: 5 };
            const multiplier = multipliers[numbers.length] || 0;

            return isWin ? amount * multiplier : -amount;
        }

        // 2. Handle Outside Bets
        const REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        let isWin = false;
        let payoutMult = 1; // Default for Evens (Red/Black, Odd/Even, High/Low)

        if (winNum === 0) return -amount; // Outside bets always lose on 0

        switch (betCode.toLowerCase()) {
            case 'red': isWin = REDS.includes(winNum); break;
            case 'black': isWin = !REDS.includes(winNum); break;
            case 'even': isWin = winNum % 2 === 0; break;
            case 'odd': isWin = winNum % 2 !== 0; break;
            case 'low': isWin = winNum <= 18; break;
            case 'high': isWin = winNum >= 19; break;
            case 'dozen-1': isWin = winNum <= 12; payoutMult = 2; break;
            case 'dozen-2': isWin = winNum > 12 && winNum <= 24; payoutMult = 2; break;
            case 'dozen-3': isWin = winNum > 24; payoutMult = 2; break;
            // ... add column logic if needed
        }

        return isWin ? amount * payoutMult : -amount;
    };
    const myBets = {
        "0": 1.5,                 // Straight Up (0 Green)
        "2": 1.0,                 // Straight Up
        "4": 0.5,                 // Straight Up
        "17": 1.0,                // Straight Up
        "20": 1.5,                // Straight Up
        "21": 0.5,                // Straight Up
        "black": 2.0,             // Outside Bet
        "1-4": 0.5,               // Split
        "4-7": 0.5,               // Split
        "17-18-20-21": 0.5        // Corner
    };
    // Map through them to display all 52 cards
    return (
        <RoundDetailsProvider>
            <div className="flex flex-col gap-2">
                <RoundInvestigator />
                <GameMetadata />
                <RoundOverview />
                <RoundAudit roundId={dummyRoundData.roundId} data={dummyRoundData} />
                <ResolutionEditor />
                <DeckDisplay />
                <ProfessionalRoulette winningNumber={33} bets={myBets} totalWinAmount={4.00} />
            </div>
        </RoundDetailsProvider>
    );
}

const DeckDisplay = () => {
    const suits: Suit[] = ['S', 'H', 'D', 'C'];
    const ranks: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Standard 52-Card Deck</h2>

            {/* Grid Layout: 13 cards per row */}
            <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-3">
                {suits.map((s) =>
                    ranks.map((r) => (
                        <div key={r + s} className="flex flex-col items-center">
                            <MiniPlayingCard rank={r} suit={s} size={60} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};