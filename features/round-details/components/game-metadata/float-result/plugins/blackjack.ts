import { GamePlugin } from "@/features/round-details/components/game-metadata/float-result/core/types";
import { getBlackjackRoundResult } from "../../game-result/result-sheets/blackjack/blackjack-round-result";

export const blackjackPlugin: GamePlugin = {
    key: "blackjack",

    resolve: ({
        cardDetails,
        cardMapping,
        styleMap,
        betTable,
    }: any) => {

        if (!cardMapping || cardMapping.length === 0) {
            return {
                label: "PENDING",
                className: styleMap["blackjack-default"],
                textClassName: "text-white",
            };
        }

        const result = getBlackjackRoundResult(
            cardDetails || [],
            cardMapping,
            betTable || []
        );

        const dealer = result.dealer;
        const players = result.players;
        const winners = result.winners;
        const pushes = result.pushes || [];

        const winnerCount = winners.length;
        const pushCount = pushes.length;
        const totalPlayers = players.length;

        let label = "LOSE";

        if (winnerCount === totalPlayers && totalPlayers > 0) {
            label = "WIN";
        } else if (pushCount === totalPlayers && totalPlayers > 0) {
            label = "PUSH";
        } else if (winnerCount > 0 || pushCount > 0) {
            label = "Half Win";
        }

        /**
         * PRIORITY OVERRIDES
         */
        if (dealer.isBust) {
            label = "DLR BUST";
        }

        const hasBlackjack = players.some((p: any) => p.isBlackjack);

        if (hasBlackjack) {
            label = "BLACKJACK";
        }

        const classMap: Record<string, string> = {
            WIN: styleMap["blackjack-win"],
            "Half Win": styleMap["blackjack-partial"],
            LOSE: styleMap["blackjack-lose"],
            PUSH: styleMap["blackjack-push"],
            "DLR BUST": styleMap["blackjack-dealer-bust"],
            BLACKJACK: styleMap["blackjack-blackjack"],
        };

        return {
            label,
            className: classMap[label] || styleMap["blackjack-default"],
            textClassName: "text-white",
        };
    },
};