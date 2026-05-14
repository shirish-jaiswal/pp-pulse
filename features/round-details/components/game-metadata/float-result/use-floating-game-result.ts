import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { useFindCards } from "@/hooks/excel-db/use-baccarat-cards";
import { getGameType } from "@/utils/get-game-type";

import { gamePlugins } from "@/features/round-details/components/game-metadata/float-result/core/registry";
import { styleMap } from "@/features/round-details/components/game-metadata/float-result/core/styleMap";
import { FloatingGameResult } from "@/features/round-details/components/game-metadata/float-result/core/types";
export function useFloatingGameResult(): FloatingGameResult | null {
    // 1. All hooks are called here at the top level
    const context = useRoundDetails();
    const { roundDetails } = context; // Extract whatever the plugins need

    const gameDetails = roundDetails?.gameDetails || [];
    const cardDetails = roundDetails?.cardDetails || [];
    const betTable = roundDetails?.betInfo || [];
    const gameType = getGameType(gameDetails?.[0]?.game_type || "");
    const resultCodes = cardDetails.map((e) => e.resultcode_id).filter(Boolean);

 const { data: cards, isLoading } = useFindCards({
        code: resultCodes,
    });

    // Clean the array to remove non-numeric keys like _debugInfo seen in image_e8f398.png
    const cleanCardsArray = Array.isArray(cards)
        ? cards.filter(item => item && typeof item === 'object' && 'code' in item)
        : [];

    console.log("CardsClean", cleanCardsArray)
    const plugin = gamePlugins[gameType];

    if (!plugin) {
        return {
            label: "--",
            className: styleMap.default,
            textClassName: "text-white",
        };
    }

    return plugin.resolve({
        gameDetails,
        cardDetails,
        cardMapping: cleanCardsArray,
        styleMap,
        betTable,
        context
    });
}