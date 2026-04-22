import { BetHistoryWrapper } from "@/features/bet-history/components/bet-history-wrapper";

interface PageProps {
    searchParams: Promise<{
        playerId?: string;
        from?: string;
        to?: string;
    }>;
}

export default async function Page({ searchParams }: PageProps) {
    const { playerId, from, to } = await searchParams;

    return (
        <BetHistoryWrapper
            playerId={playerId}
            from={from}
            to={to}
        />
    );
}