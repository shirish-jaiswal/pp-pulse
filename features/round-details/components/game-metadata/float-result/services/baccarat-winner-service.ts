import { getBaccaratWinnerFromEvents } from "@/features/round-details/components/round-audit/tab-content/card-details/baccarat/baccarat-hand-report-rules";

export function resolveBaccaratWinner(cardDetails: any, extraData: any[]) {
    return getBaccaratWinnerFromEvents(cardDetails, extraData || []);
}