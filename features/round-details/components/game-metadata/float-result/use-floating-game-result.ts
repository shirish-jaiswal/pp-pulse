import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { useFindBaccaratCards } from "@/hooks/excel-db/use-baccarat-cards";
import { getGameType } from "@/utils/get-game-type";

import { gamePlugins } from "@/features/round-details/components/game-metadata/float-result/core/registry";
import { styleMap } from "@/features/round-details/components/game-metadata/float-result/core/styleMap";
import { FloatingGameResult } from "@/features/round-details/components/game-metadata/float-result/core/types";

export function useFloatingGameResult(): FloatingGameResult | null {
    const { roundDetails } = useRoundDetails();

    const gameDetails = roundDetails?.gameDetails || [];
    const cardDetails = roundDetails?.cardDetails || [];

    const gameType = getGameType(gameDetails?.[0]?.game_type || "");

    const resultCodes = cardDetails.map((e) => e.resultcode_id).filter(Boolean);

    const { data: baccaratCards } = useFindBaccaratCards({
        code: resultCodes,
    });

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
        extraData: baccaratCards,
        styleMap,
    });
}