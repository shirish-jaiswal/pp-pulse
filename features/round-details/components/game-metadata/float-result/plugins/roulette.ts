import { GamePlugin } from "@/features/round-details/components/game-metadata/float-result/core/types";
import { getFirst } from "@/features/round-details/components/game-metadata/float-result/utils/get-first";

export const roulettePlugin: GamePlugin = {
    key: "roulette",

    resolve: ({ gameDetails, styleMap }) => {
        const raw = (getFirst(gameDetails, "Description") ?? "")
            .toString()
            .toLowerCase();

        let color: "red" | "black" | "tie" = "tie";

        if (raw.includes("red")) color = "red";
        else if (raw.includes("black")) color = "black";

        const number = raw.match(/\d+/)?.[0];

        return {
            label: number ?? color.toUpperCase(),
            className: styleMap[`roulette-${color}`],
            textClassName: "text-white",
        };
    },
};