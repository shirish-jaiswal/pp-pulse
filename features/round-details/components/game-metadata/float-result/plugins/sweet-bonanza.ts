import { sb_floatResult } from "@/features/round-details/components/game-metadata/game-result/result-sheets/sweet-bonanza/rules";
import { GamePlugin } from "@/features/round-details/components/game-metadata/float-result/core/types";

export const sweetBonanzaPlugin: GamePlugin = {
    key: "sweet-bonanza",

    resolve: ({ gameDetails }) => {
        const img = sb_floatResult(gameDetails);
        console.log("img :: ", img)
        return {
            label: "BONUS",
            imgurl: img || "",
            className: "border-pink-500 bg-pink-500/10",
            textClassName: "text-white",
        };
    },
};