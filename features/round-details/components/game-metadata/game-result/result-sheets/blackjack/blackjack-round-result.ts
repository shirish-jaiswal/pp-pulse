import { CardDetailsInfo } from "@/features/round-details/types/card-details";

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
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";

export const getBlackjackRoundResult = (
    events: CardDetailsInfo,
    cardDetails: any[],
    betTable: BetTableInfo
): BlackjackRoundResult => {

    const dealer = getDealerHand(
        events,
        cardDetails,
    );

    const players = getBlackjackPlayers(
        events,
        cardDetails,
        betTable || []
    );

    const winners = getBlackjackWinners(
        players,
        dealer
    );

    return {
        dealer,
        players,
        winners,
    };
};