"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Check, Copy } from "lucide-react";
import { cn } from "@/utils/cn";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { resultRegistry } from "@/features/round-details/components/game-metadata/game-result/result-registry";
import GenericGameResultSheet from "@/features/round-details/components/game-metadata/game-result/generic-game-result-sheet";
import { useFloatingGameResult } from "@/features/round-details/components/game-metadata/float-result/use-floating-game-result";
import { Button } from "@/components/ui/button";

const FLOATING_POPUP_GAMES = [
  "sweet-bonanza",
  "baccarat",
  "dragon-tiger",
  "blackjack",
];

const GameMetadata = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<string>("default");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { gameMetadata } = useRoundDetails();
  const floatingResult = useFloatingGameResult();

  const handleOpenSheet = (type: string = "default") => {
    setSheetType(type);
    setSheetOpen(true);
  };

  const handleCopyValue = async (value: string, index: number) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch (err) {
      console.error("Failed to copy metadata value to clipboard: ", err);
    }
  };

  const sheetConfig = resultRegistry[sheetType] || resultRegistry.default;
  const SheetComponent = sheetConfig.component;

  if (!gameMetadata) return null;

  // Filter out any metadata blocks that do not have a value present
  const validMetadata = gameMetadata.filter(
    (item) => item.value !== undefined && item.value !== null && String(item.value).trim() !== ""
  );

  // Fallback to hide the entire bar if no valid metrics exist to display
  if (validMetadata.length === 0) return null;

  const resultItem = validMetadata.find((item) => item.label === "Result");

  return (
    <>
      {/* TOP METADATA BAR */}
      <div className="w-full flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-zinc-900/60 backdrop-blur-md px-1.5 py-1 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-2 flex-1">
          {validMetadata.map((item, index) => {
            const isFloatingPopupGame =
              item.label === "Result" &&
              item.showPopupOf &&
              FLOATING_POPUP_GAMES.includes(item.showPopupOf);

            const isCopied = copiedIndex === index;

            if (isFloatingPopupGame) {
              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleOpenSheet(item.showPopupOf || "default")}
                  size="xs"
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold rounded-md px-2.5 py-1 transition-all border shadow-sm",
                    "bg-white/80 dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200",
                    "hover:bg-slate-50 dark:hover:bg-zinc-700/50 hover:border-slate-300 dark:hover:border-zinc-600"
                  )}
                >
                  <span>{item.label}</span>
                  <ExternalLink className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
                </Button>
              );
            }

            return (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="font-medium text-slate-400 dark:text-zinc-500 select-none uppercase tracking-wider text-[10px]">
                  {item.label}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyValue(item.value, index)}
                  className={cn(
                    "group relative flex items-center gap-1.5 font-medium rounded px-2 py-0.5 border border-transparent transition-all",
                    "bg-slate-100/40 dark:bg-zinc-800/40 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700",
                    isCopied && "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-500/30"
                  )}
                  title="Click to copy value"
                >
                  <span
                    className={cn(
                      "text-zinc-800 dark:text-zinc-200 transition-colors duration-150",
                      item.isTechnical && "font-mono tracking-tight",
                      isCopied && "text-emerald-600 dark:text-emerald-400 font-semibold"
                    )}
                  >
                    {item.value}
                  </span>

                  <span className="flex items-center justify-center w-3 h-3 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-400">
                    {isCopied ? (
                      <Check className="h-3 w-3 text-emerald-500 shrink-0 scale-110 motion-safe:animate-pulse" />
                    ) : (
                      <Copy className="h-2.5 w-2.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                    )}
                  </span>
                </button>

                {item.showPopupOf && (
                  <button
                    onClick={() => handleOpenSheet(item.showPopupOf!)}
                    className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING ACTION BANNER POPUP */}
      {floatingResult && resultItem && (
        <button
          onClick={() => handleOpenSheet(resultItem.showPopupOf || "default")}
          className="fixed bottom-6 right-6 z-50 group transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 rounded-full blur-xl opacity-30 bg-indigo-500/40 dark:bg-indigo-400/20 group-hover:opacity-60 transition duration-300" />

          <div
            className={cn(
              "relative h-14 w-14 rounded-full flex items-center justify-center overflow-hidden",
              "border border-white/40 dark:border-zinc-700/50 shadow-xl",
              "backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70",
              floatingResult.className
            )}
          >
            {floatingResult.imgurl ? (
              <Image
                src={floatingResult.imgurl}
                alt={floatingResult.label}
                fill
                className="object-cover"
              />
            ) : (
              <span
                className={cn(
                  "w-full h-full flex items-center justify-center text-center font-bold tracking-wider leading-none px-1 uppercase",
                  "text-[11px]",
                  floatingResult.textClassName
                )}
              >
                {floatingResult.label}
              </span>
            )}
          </div>
        </button>
      )}

      {/* MODAL SHEET WRAPPER */}
      <GenericGameResultSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={sheetConfig.title}
      >
        <SheetComponent />
      </GenericGameResultSheet>
    </>
  );
};

export default GameMetadata;