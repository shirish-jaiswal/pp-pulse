import { GamePlugin } from "@/features/round-details/components/game-metadata/float-result/core/types";
import { getFirst } from "@/features/round-details/components/game-metadata/float-result/utils/get-first";

export const crashPlugin: GamePlugin = {
    key: "crash-game",

    resolve: ({ gameDetails, styleMap }) => {
        const value = Number(getFirst(gameDetails, "state_indicator") ?? 0);

        const multiplier = (value / 100).toFixed(2);

        return {
            label: `${multiplier}x`,
            className: styleMap.crash,
            textClassName: "text-white",
        };
    },
};