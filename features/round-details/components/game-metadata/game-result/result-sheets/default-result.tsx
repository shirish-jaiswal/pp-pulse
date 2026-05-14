"use client";

import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { ResultSheetHeaderBlock } from "@/features/round-details/components/game-metadata/game-result/result-sheets/result-sheet-header-block";

const DefaultNoPopup = () => {
  const { roundDetails } = useRoundDetails();
  const gameDetails = roundDetails?.gameDetails || [];

  const gameResult = gameDetails?.[0].Description;
  const gameName = gameDetails?.[0].game_type || "Game Result";

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">
        {gameName}
      </div>
      <ResultSheetHeaderBlock />

      <div className="rounded-lg border p-3">
        {gameResult}
      </div>
    </div>
  );
};

export default DefaultNoPopup;