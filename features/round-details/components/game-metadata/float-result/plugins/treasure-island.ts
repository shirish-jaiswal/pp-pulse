import { styleMap } from "@/features/round-details/components/game-metadata/float-result/core/styleMap";
import { GamePlugin } from "@/features/round-details/components/game-metadata/float-result/core/types";
import { getFirst } from "@/features/round-details/components/game-metadata/float-result/utils/get-first";

export const treasureIslandPlugin: GamePlugin = {
    key: "treasure-island",

    resolve: ({ gameDetails }) => {
        const value = getFirst(gameDetails, "multiplier");

        const multiplier =
            typeof value === "number"
                ? value
                : Number(value ?? 0);

        return {
            label: `${multiplier}`,
            className:
                styleMap[`treasure-island`],
            textClassName: "text-white",
        };
    },
};