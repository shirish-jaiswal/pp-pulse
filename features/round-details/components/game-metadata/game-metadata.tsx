"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
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
];

const GameMetadata = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [sheetType, setSheetType] =
    useState<string>("default");

  const { gameMetadata } = useRoundDetails();

  const floatingResult =
    useFloatingGameResult();

  const handleOpenSheet = (
    type: string = "default"
  ) => {
    setSheetType(type);
    setSheetOpen(true);
  };

  const sheetConfig =
    resultRegistry[sheetType] ||
    resultRegistry.default;

  const SheetComponent =
    sheetConfig.component;

  if (!gameMetadata) return null;

  const resultItem = gameMetadata.find(
    (item) => item.label === "Result"
  );

  return (
    <>
      {/* TOP BAR */}
      <div className="w-full flex items-center justify-between rounded-xl border bg-background px-3 py-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-1">
          {gameMetadata.map((item, index) => {
            const isFloatingPopupGame =
              item.label === "Result" &&
              item.showPopupOf &&
              FLOATING_POPUP_GAMES.includes(
                item.showPopupOf
              );

            if (isFloatingPopupGame) {
              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() =>
                    handleOpenSheet(
                      item.showPopupOf ||
                      "default"
                    )
                  }
                  size="xs"
                  className="border flex items-center gap-1.5 text-sm rounded-md p-0 px-0 py-0 hover:bg-muted transition"
                >
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>

                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              );
            }

            return (
              <div
                key={index}
                className="flex items-center gap-1.5 text-sm"
              >
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>

                <span
                  className={cn(
                    "font-medium",
                    item.isTechnical &&
                    "font-mono text-foreground"
                  )}
                >
                  {item.value}
                </span>

                {item.showPopupOf && (
                  <button
                    onClick={() =>
                      handleOpenSheet(
                        item.showPopupOf!
                      )
                    }
                    className="ml-1 rounded-md p-1 hover:bg-muted transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING RESULT */}
      {floatingResult && (
        <button
          onClick={() =>
            handleOpenSheet(
              resultItem?.showPopupOf ||
              "default"
            )
          }
          className="fixed bottom-6 right-6 z-50 group transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 rounded-full blur-2xl opacity-40 bg-white/10 group-hover:opacity-70 transition duration-300" />

          <div
            className={cn(
              "relative h-16 w-16 rounded-full flex items-center justify-center overflow-hidden",
              "border-4 shadow-2xl",
              "backdrop-blur-md",
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
                  "w-full h-full flex items-center justify-center text-center font-bold tracking-wide leading-none px-1",
                  "text-[clamp(10px,2.2vw,18px)]",
                  floatingResult.textClassName
                )}
              >
                {floatingResult.label}
              </span>
            )}
          </div>
        </button>
      )}

      {/* SHEET */}
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