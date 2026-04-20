import { RoundDetailsWrapper } from "@/features/round-details/components/round-details-wrapper";
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";
import { TPTTableInfo } from "@/features/round-details/types/tpt-table-info";

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
    return (
        <RoundDetailsWrapper
            roundId={roundId}
            gameId={gameId}
            userId={userId}
        />
    );
}