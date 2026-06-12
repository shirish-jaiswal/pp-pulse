import { CardDetailsInfo } from "@/features/round-details/types/card-details";
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";

import {
    BlackjackRoundResult,
} from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/blackjack-types";
import {
    getDealerHand,
} from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/blackjack-dealer-rules";
import {
    getBlackjackPlayers,
} from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/blackjack-player-rules";
import {
    getBlackjackWinners,
} from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/blackjack-winner-rules";

export const getBlackjackRoundResult = (
    events: CardDetailsInfo,
    cardDetails: any[],
    betTable: BetTableInfo
): BlackjackRoundResult => {

    // 1. Extracts dealer events, tracks hidden cards, and flags 'offeredInsurance'
    const dealer = getDealerHand(
        events,
        cardDetails,
    );

    // 2. Extracts player hands and flags 'hasTakenInsurance' per active betting seat
    const players = getBlackjackPlayers(
        events,
        cardDetails,
        betTable || []
    );

    // 3. Compares final scores, busts, and blackjack states
    const { winners, pushes } = getBlackjackWinners(
        players,
        dealer
    );

    return {
        dealer,
        players,
        winners,
        pushes,
    };
};