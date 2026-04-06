import { RoundDetailsWrapper } from "@/features/round-details/components/round-details-wrapper";
import { RoundDetailsInputFormSchema } from "@/features/round-details/types/round-details-input";

interface PageProps {
    searchParams: Promise<{
        roundId?: string;
        gameId?: string;
        userId?: string;
    }>;
}

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

export default async function Page({ searchParams }: PageProps) {
    const { roundId, gameId, userId } = await searchParams;

    const payload = roundId
        ? { round_id: roundId }
        : { game_id: gameId, user_id: userId };

    const validation = RoundDetailsInputFormSchema.safeParse(payload);

    if (!validation.success) {
        return <RoundDetailsWrapper />;
    }

    return (
        <RoundDetailsWrapper
            roundId={validation.data.round_id || ""}
            gameId={validation.data.game_id || ""}
            userId={validation.data.user_id || ""}
            data={dummyRoundData}
        />
    );
}