// game-handlers.ts
import { FloatingGameResult, styleMap } from "./use-floating-game-result";
import { sb_floatResult } from "../game-result/result-sheets/sweet-bonanza/rules";
import { getBaccaratWinnerFromEvents } from "../../round-audit/tab-content/card-details/baccarat/baccarat-hand-report-rules";

type HandlerParams = {
    gameDetails: any[];
    cardDetails: any[];
    extraData?: any;
};

export const GameHandlers: Record<string, (params: HandlerParams) => FloatingGameResult> = {
    "sweet-bonanza": ({ gameDetails }) => {
        const sbData = sb_floatResult(gameDetails);
        return {
            label: "BONUS",
            imgurl: sbData || "",
            className: "border-pink-500 bg-pink-500/10",
            textClassName: "text-white",
        };
    },

    "roulette": ({ gameDetails }) => {
        const raw = (gameDetails?.[0]?.Description || "").toString().toLowerCase();
        let colorKey: "red" | "black" | "tie" = "tie";

        if (raw.includes("red")) colorKey = "red";
        else if (raw.includes("black")) colorKey = "black";

        const number = raw.match(/\d+/)?.[0];
        return {
            label: number || colorKey.toUpperCase(),
            className: styleMap[`roulette-${colorKey}`] || styleMap.default,
            textClassName: "text-white",
        };
    },

    "baccarat": ({ cardDetails, extraData }) => {
        let winner = getBaccaratWinnerFromEvents(cardDetails, extraData || []);
        if (winner === "PLAYER") {
            winner = "PLR";
        } else if (winner === "BANKER") {
            winner = "BNK";
        } else {
            winner = "TIE";
        }
        return {
            label: winner,
            className:
                winner === "PLR" ? styleMap["baccarat-player"] :
                    winner === "BNK" ? styleMap["baccarat-banker"] :
                        styleMap["roulette-tie"],
            textClassName: "text-white",
        };
    },

    // EASILY ADD NEW GAMES HERE
    // "blackjack": (params) => { ... }
};