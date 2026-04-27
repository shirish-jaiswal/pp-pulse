"use client";

import { MiniPlayingCard } from "@/components/custom/games/playing-card";
import { useFindBaccaratCards } from "@/hooks/excel-db/use-baccarat-cards";


export default function BaccaratTestPage() {
  const { data, isLoading, error } = useFindBaccaratCards({
    code: [
      "BC000000000007Cm",
      "BC000000000008Dm",
      "BC000000000001Sm",
      "BC00000000000QHm",
    ],
  });
  console.log("data", data);
  if (isLoading) {
    return <div className="p-6">Loading cards...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading cards</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Baccarat Cards Test</h1>

      <div className="flex flex-wrap gap-4">
        {data?.map((card: any) => (
          <div key={card.code} className="flex flex-col items-center gap-2">
            <MiniPlayingCard rank={card.rank} suit={card.suit} />
            <div className="text-xs text-gray-600 text-center">
              {card.code}
              <br />
              {card.rank} {card.suit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}