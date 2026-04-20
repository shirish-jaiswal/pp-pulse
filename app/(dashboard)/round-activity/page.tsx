import { RoundDetailsWrapper } from "@/features/round-details/components/round-details-wrapper";
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";
import { TPTTableInfo } from "@/features/round-details/types/tpt-table-info";
import generateRoundOverview from "./round-overview";
import { getRoundDetails } from "@/lib/api/round-details/round-details";

interface PageProps {
    searchParams: Promise<{
        roundId?: string;
        gameId?: string;
        userId?: string;
    }>;
}

export interface RoundDetailsResponse {
    tptInfo?: TPTTableInfo,
    betInfo?: BetTableInfo,
}

export default async function Page({ searchParams }: PageProps) {
    const { roundId, gameId, userId } = await searchParams;
    const hasRequiredParams = roundId || (gameId && userId);
    let roundDetails: RoundDetailsResponse | null = null;
    if (hasRequiredParams) {
        try {
            const payload = roundId
                ? { round_id: roundId }
                : { game_id: gameId, user_id: userId };
            console.log("📦 Payload:", payload);
            roundDetails = await getRoundDetails(payload);
            console.log("📦 Round details:", roundDetails);
        } catch (error) {
            return (
                <RoundDetailsWrapper
                    error={true}
                    roundId={roundId || ""}
                    gameId={gameId || ""}
                    userId={userId || ""}
                    data={null}
                />);
        }
    }

    const { roundOverview } = await generateRoundOverview(roundDetails);

    return (
        <RoundDetailsWrapper
            roundId={roundId || ""}
            gameId={gameId || ""}
            userId={userId || ""}
            data={roundDetails}
            roundOverview={roundOverview}
        />
    );
}