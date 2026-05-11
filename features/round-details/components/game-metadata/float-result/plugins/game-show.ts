import { GamePlugin } from "@/features/round-details/components/game-metadata/float-result/core/types";
import { getFirst } from "@/features/round-details/components/game-metadata/float-result/utils/get-first";
import { normalize } from "@/features/round-details/components/game-metadata/float-result/utils/normalize";

export const gameShowPlugin: GamePlugin = {
    key: "game-show",

    resolve: ({ gameDetails }) => {
        const raw = normalize(getFirst(gameDetails, "Description"));

        return {
            label: raw || "--",
            className:
                "bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-700",
            textClassName: "text-white",
        };
    },
};