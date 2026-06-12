import { RoundDetailsWrapper } from "@/features/round-details/components/round-details-wrapper";
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";
import { CardDetailsInfo } from "@/features/round-details/types/card-details";
import { RoundMetaInfo } from "@/features/round-details/types/game-details";
import { CrashGameData } from "@/features/round-details/types/crash-games";
import { TPTTableInfo } from "@/features/round-details/types/tpt-table-info";
import { HighflyerResponseType } from "@/features/round-details/types/highflyer";
import { TicketProvider } from "@/features/round-details/components/freshdesk/ticket-context";

interface PageProps {
    searchParams: Promise<{
        roundId?: string;
        gameId?: string;
        userId?: string;
        isBulk?: boolean;
        roundIds?: string
    }>;
}

export interface RoundDetailsResponse {
    tptInfo?: TPTTableInfo,
    betInfo?: BetTableInfo,
    gameDetails?: RoundMetaInfo
    cardDetails?: CardDetailsInfo
    isCardGame?: boolean
    crashGamesData?: CrashGameData
    highflyerData?: HighflyerResponseType
}

export default async function Page({ searchParams }: PageProps) {
    const { roundId, gameId, userId, isBulk, roundIds } = await searchParams;
    const parsedRoundIds = roundIds
        ? roundIds.split(",").map(id => id.trim()).filter(Boolean)
        : [];
    return (
        <TicketProvider>
            <RoundDetailsWrapper
                roundId={roundId}
                gameId={gameId}
                userId={userId}
                isBulk={isBulk}
                roundIds={parsedRoundIds}
            />
        </TicketProvider>
    );
}