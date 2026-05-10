"use client";

import { useRoundDetails } from "@/features/round-details/context/round-details-context";

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

      <div className="rounded-lg border p-3">
        {gameResult}
      </div>
    </div>
  );
};

export default DefaultNoPopup;