import { GamePlugin } from "@/features/round-details/components/game-metadata/float-result/core/types";
import { resolveBaccaratWinner } from "@/features/round-details/components/game-metadata/float-result/services/baccarat-winner-service";

export const baccaratPlugin: GamePlugin = {
    key: "baccarat",

    resolve: ({ cardDetails, cardMapping, styleMap }) => {
        const winner = resolveBaccaratWinner(cardDetails, cardMapping);

        const map: Record<string, string> = {
            PLAYER: "PLR",
            BANKER: "BNK",
            TIE: "TIE",
        };

        const result = map[winner] || "TIE";

        const classMap: Record<string, string> = {
            PLR: styleMap["baccarat-player"],
            BNK: styleMap["baccarat-banker"],
            TIE: styleMap["baccarat-tie"],
        };

        return {
            label: result,
            className: classMap[result],
            textClassName: "text-white",
        };
    },
};