import { getBaccaratWinnerFromEvents } from "@/features/round-details/components/game-metadata/game-result/result-sheets/baccarat/baccarat-hand-report-rules";

export function resolveBaccaratWinner(cardDetails: any, extraData: any[]) {
    return getBaccaratWinnerFromEvents(cardDetails, extraData || []);
}