"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { processGameDetails, IMAGE_MAP } from "@/features/round-details/components/game-metadata/game-result/result-sheets/sweet-bonanza/rules";
import { ResultSheetHeaderBlock } from "@/features/round-details/components/game-metadata/game-result/result-sheets/result-sheet-header-block";

const SweetBonanzaResult = () => {
  const { roundDetails } = useRoundDetails();
  const gameDetails = roundDetails?.gameDetails || [];

  const { triggers, bonusResults, multipliers } = useMemo(
    () => processGameDetails(gameDetails),
    [gameDetails]
  );

  return (
    <div className="flex flex-col gap-2 text-slate-800 text-sm">

      <ResultSheetHeaderBlock />

      {Object.values(triggers).length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {Object.values(triggers).map((trigger: any) => (
            <div
              key={trigger.resultcode_id}
              className="flex items-center justify-between border px-3 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={IMAGE_MAP[trigger.bonusType]}
                  alt={trigger.bonusType}
                  width={52}
                  height={32}
                  className="object-contain"
                />

                <span className="font-bold text-slate-900 text-base">
                  {trigger.bonusType === "sweet_spin"
                    ? "Sweet Spins Triggered"
                    : trigger.bonusType === "candy_drop"
                      ? "Candy Drop Triggered"
                      : trigger.bonusType === "bubble_surprise"
                        ? "Bubble Surprise Triggered"
                        : trigger.bonusType}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Table */}
      <div className="border rounded-md overflow-hidden bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-tight">
                Event
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-tight text-right">
                Value
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Multipliers */}
            {multipliers.map((item) => (
              <tr key={item.resultcode_id + item.multiplier} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 flex items-center gap-3">
                  <Image
                    src={IMAGE_MAP[item.imageKey]}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <span className="font-medium text-slate-700">
                    {item.displayName}
                  </span>

                  {/* ID tag slightly larger and more readable */}
                  <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                    #{item.resultcode_id}
                  </span>
                </td>

                <td className="px-4 py-3 text-right font-bold text-slate-900">
                  {item.value}x
                </td>
              </tr>
            ))}

            {/* Bonus Results */}
            {bonusResults.map((item) => (
              <tr
                key={item.resultcode_id + item.multiplier}
                className="hover:bg-purple-50/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={IMAGE_MAP[item.imageKey]}
                      alt=""
                      width={40}
                      height={40}
                    />
                    <span className="font-medium text-slate-700">
                      {item.displayName}
                    </span>
                  </div>

                  {item.candy && (
                    <div className="text-xs text-slate-500 ml-[30px] mt-1 flex items-center gap-1">
                      <span className="font-mono bg-slate-50 border px-1 rounded">
                        {item.candy.color} ({item.candy.number})
                      </span>
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 text-right font-bold text-slate-900">
                  {item.multiplier > 0 ? `${item.multiplier}x` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {multipliers.length === 0 && bonusResults.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-400 italic">
            No event data available for this session.
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetBonanzaResult;