// get-floating-data.ts
import { getGameType } from "@/utils/get-game-type";
import { useRoundDetails } from "../../../context/round-details-context";
import { useFindBaccaratCards } from "@/hooks/excel-db/use-baccarat-cards";
import { GameHandlers } from "./game-handlers";

export type FloatingGameResult = {
    label: string;
    imgurl?: string;
    className?: string;
    textClassName?: string;
};

export const styleMap = {
    "roulette-red": "bg-red-700 border-red-900",
    "roulette-black": "bg-gray-800 border-gray-950",
    "roulette-tie": "bg-green-500 border-green-900",
    "baccarat-player": "bg-blue-500 border-blue-900",
    "baccarat-banker": "bg-red-500 border-red-900",
    default: "bg-gray-500 border-gray-700",
} as const;

export function useFloatingGameResult(): FloatingGameResult | null {
    const { roundDetails } = useRoundDetails();

    const gameDetails = roundDetails?.gameDetails || [];
    const cardDetails = roundDetails?.cardDetails || [];
    const gameType = getGameType(gameDetails?.[0]?.game_type || "");

    // Handle hooks logic (since hooks can't be conditional)
    const resultCodes = cardDetails.map((e) => e.resultcode_id).filter(Boolean);
    const { data: baccaratCards } = useFindBaccaratCards({ code: resultCodes });

    // Look up the handler
    const handler = GameHandlers[gameType];

    if (!handler) {
        return {
            label: "RESULT",
            className: styleMap.default,
            textClassName: "text-white",
        };
    }

    return handler({
        gameDetails,
        cardDetails,
        extraData: baccaratCards
    });
}