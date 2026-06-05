"use client";

import React, { useMemo } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dices } from "lucide-react";
import { INSERT_GAME_RESULT_COMMAND } from "./GameResultPlugin";

// Telemetry & Data Access
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { useFindCards } from "@/hooks/excel-db/use-baccarat-cards";
import { getGameType } from "@/utils/get-game-type";

// --- Game Logic Handlers & Transformers ---
import { getBlackjackRoundResult } from "@/features/round-details/components/game-metadata/game-result/result-sheets/blackjack/blackjack-round-result";
import { transformBlackjackToConfig } from "@/components/custom/text-editor/toolbar/game-result/blackjack/blackjack-transformer";
import { transformBaccaratToConfig } from "./baccarat/baccarat-trasnformer";
import { transformHighflyerToConfig } from "./carash-games/highflyer-transformer";
import { transformSpacemanToConfig } from "./carash-games/spaceman-transformer";

export function GameResultDropdown() {
  const [editor] = useLexicalComposerContext();

  const { roundDetails, selectedRoundDetailsMap } = useRoundDetails();

  // 1. Prioritize multi-select map values, default back to round details
  const roundItemsArray = useMemo(() => {
    if (selectedRoundDetailsMap && typeof selectedRoundDetailsMap === "object") {
      const selectedRounds = Object.values(selectedRoundDetailsMap);
      if (selectedRounds.length > 0) return selectedRounds;
    }

    if (!roundDetails) return [];
    if (typeof roundDetails === "object" && !Array.isArray(roundDetails)) {
      if (!roundDetails.cardDetails && !roundDetails.gameDetails) {
        return Object.values(roundDetails);
      }
      return [roundDetails];
    }
    return Array.isArray(roundDetails) ? roundDetails : [roundDetails];
  }, [roundDetails, selectedRoundDetailsMap]);

  // 2. Aggregate across all combined rounds to query cards from database in a single hook batch
  const allEvents = useMemo(() => {
    return roundItemsArray.flatMap(rd => rd?.cardDetails || []);
  }, [roundItemsArray]);

  const resultCodes = useMemo(() => {
    return allEvents.map((e) => e.resultcode_id).filter(Boolean);
  }, [allEvents]);

  const { data: cardDetails } = useFindCards({ code: resultCodes });

  // 3. Dynamic Evaluation Check to handle both Card-based and Telemetry-based (Crash) Rounds
  const hasData = useMemo(() => {
    if (roundItemsArray.length === 0) return false;

    return roundItemsArray.some((round) => {
      const hasCards = Array.isArray(round?.cardDetails) && round.cardDetails.length > 0;
      const hasCrashData = Array.isArray(round?.crashGamesData) && round.crashGamesData.length > 0;
      const hasHighflyerData = Array.isArray(round?.highflyerData) && round.highflyerData.length > 0;

      return hasCards || hasCrashData || hasHighflyerData;
    });
  }, [roundItemsArray]);

  const handleInsertLiveResult = () => {
    if (!hasData) return;

    try {
      const processedRoundsPayloads = roundItemsArray.map((roundContextItem, rIdx) => {
        const roundEvents = roundContextItem?.cardDetails || [];
        const roundBetTable = roundContextItem?.betInfo || [];

        // Get the raw string and normalized type
        const rawTypeFromPayload = roundContextItem?.gameDetails?.at(0)?.game_type;
        const currentRoundGameType = getGameType(rawTypeFromPayload?.toLowerCase()) || "";

        switch (currentRoundGameType) {
          case "blackjack": {
            const calculatedResult = getBlackjackRoundResult(roundEvents, cardDetails || [], roundBetTable || []);
            const blackjackConfig = transformBlackjackToConfig({
              roundDetails: roundContextItem,
              result: calculatedResult,
              cardDetails,
            });
            return blackjackConfig ? { ...blackjackConfig, gameType: "blackjack" } : null;
          }
          case "baccarat": {
            const baccaratConfig = transformBaccaratToConfig({
              roundDetails: roundContextItem,
              cardDetails,
            });
            return baccaratConfig ? { ...baccaratConfig, gameType: "baccarat" } : null;
          }
          case "spaceman":
          case "big-bass":
            const spacemanConfig = transformSpacemanToConfig({ roundDetails: roundContextItem });
            return spacemanConfig ? { ...spacemanConfig, gameType: currentRoundGameType } : null;
          case "highflyer": {
            const highflyerConfig = transformHighflyerToConfig({ roundDetails: roundContextItem });
            return highflyerConfig ? { ...highflyerConfig, gameType: currentRoundGameType } : null;
          }
          default:
            return null;
        }
      }).filter(Boolean);

      console.log("📦 [Dropdown] Total successfully transformed payloads:", processedRoundsPayloads.length);

      if (processedRoundsPayloads.length === 0) {
        return;
      }

      const finalizedMultiRoundConfig = {
        gameType: "mixed",
        rounds: processedRoundsPayloads,
      };

      const serializedPayload = JSON.stringify(finalizedMultiRoundConfig);

      editor.focus();
      setTimeout(() => {
        editor.update(() => {
          editor.dispatchCommand(INSERT_GAME_RESULT_COMMAND, serializedPayload);
        });
        console.log("✈️ [Dropdown] editor.dispatchCommand event sent to Lexical queue.");
      }, 60);

    } catch (err) {
      console.error("Critical error in drop-down pipeline execution context:", err);
    }
  };

  // Determine label layout text strings matching context arrays count dynamically
  const dropDownLabel = useMemo(() => {
    if (roundItemsArray.length === 0) return "Insert Live Result";

    const gameTypesInList = new Set(
      roundItemsArray.map(rd => getGameType(rd?.gameDetails?.at(0)?.game_type?.toLowerCase()))
    );

    if (gameTypesInList.size > 1) {
      return `Insert Mixed Results (${roundItemsArray.length} Rounds)`;
    }

    const singleDetectedType = Array.from(gameTypesInList)[0] || "Result";
    const titleBase = singleDetectedType.charAt(0).toUpperCase() + singleDetectedType.slice(1);

    return roundItemsArray.length > 1
      ? `${titleBase} (${roundItemsArray.length} Rounds) Result`
      : `${titleBase} Live Result`;
  }, [roundItemsArray]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={!hasData}
          className="h-8 px-2 gap-1 font-mono text-xs border border-dashed border-gray-300 hover:bg-gray-50"
        >
          <Dices className="h-3.5 w-3.5 text-gray-500" />
          <span>Insert Result</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="bg-popover border text-popover-foreground rounded-md shadow-md min-w-[180px] p-1 font-mono z-[50]">
        <DropdownMenuItem asChild className="text-xs px-2 py-1.5 cursor-pointer rounded-sm outline-none focus:bg-accent focus:text-accent-foreground">
          <button type="button" className="w-full text-left block" onClick={handleInsertLiveResult}>
            {dropDownLabel}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}