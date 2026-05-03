"use client";

import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import generateRoundOverview from "@/app/(dashboard)/round-activity/round-overview";
import useGetRoundDetails from "@/features/round-details/hook/use-get-round-details";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import generateGameMetaData from "@/app/(dashboard)/round-activity/game-metadata";

type Mode = "round" | "game";

export function MultiRoundTabs() {
  const { multiIds, setRoundDetails, setRoundOverview, setGameMetadata } =
    useRoundDetails();

  const mode: Mode = useMemo(() => {
    return multiIds.game_ids?.length ? "game" : "round";
  }, [multiIds]);

  const [activeId, setActiveId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Default active tab
  useEffect(() => {
    if (mode === "round" && multiIds.round_ids.length) {
      setActiveId(multiIds.round_ids[0]);
    }
    if (mode === "game" && multiIds.game_ids.length) {
      setActiveId(multiIds.game_ids[0]);
    }
  }, [mode, multiIds]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const ids =
    mode === "round" ? multiIds.round_ids : multiIds.game_ids;

  const {
    data: roundData,
    isLoading: isFetchingData,
    isFetching,
    isError,
  } = useGetRoundDetails({
    game_id: mode === "game" ? activeId : "",
    round_id: mode === "round" ? activeId : "",
    user_id:
      mode === "game" && multiIds.user_id
        ? multiIds.user_id
        : "",
  });

  console.log("Fetched round data for ID:", activeId, roundData);

  const isLoading = isFetchingData || isFetching;

  useEffect(() => {
    if (isError) {
      toast.error(`Failed to fetch: ${activeId}`);
    }
  }, [isError, activeId]);

  // Round overview
  const roundOverviewData = useMemo(() => {
    if (!roundData) return null;
    return generateRoundOverview(roundData);
  }, [roundData]);

  // Game metadata
  const gameMetaData = useMemo(() => {
    if (!roundData) return [];
    return generateGameMetaData(roundData.gameDetails);
  }, [roundData]);

  // Sync to context
  useEffect(() => {
    if (roundData && !isLoading) {
      setRoundDetails(roundData);

      if (roundOverviewData) {
        setRoundOverview(roundOverviewData.roundOverview);
      }

      // Only set game metadata in game mode
      if (mode === "game" && gameMetaData.length) {
        setGameMetadata(gameMetaData);
      }
    }
  }, [
    roundData,
    roundOverviewData,
    gameMetaData,
    isLoading,
    mode,
    setRoundDetails,
    setRoundOverview,
    setGameMetadata,
  ]);

  if (!ids.length) return null;

  return (
    <div className="w-full bg-background/40">
      <Tabs value={activeId} onValueChange={setActiveId}>
        <TabsList className="flex w-full gap-1 px-2 overflow-x-auto no-scrollbar">
          {ids.map((id) => {
            const isActive = activeId === id;
            const isChecked = selectedIds.includes(id);

            return (
              <TabsTrigger key={id} value={id} asChild>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition whitespace-nowrap",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50",
                    "cursor-pointer"
                  )}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleSelection(id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-3 w-3"
                  />

                  {/* Label */}
                  <div className="flex items-center gap-1 font-mono">
                    <span className="opacity-50">
                      {mode === "round" ? "R" : "G"}:
                    </span>

                    <span className="max-w-25">{id}</span>
                  </div>

                  {/* Loader */}
                  {isLoading && isActive && (
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}