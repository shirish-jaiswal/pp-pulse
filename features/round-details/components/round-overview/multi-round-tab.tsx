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
  const {
    multiIds,
    setRoundDetails,
    setRoundOverview,
    setGameMetadata
  } = useRoundDetails();

  const mode: Mode = useMemo(() => {
    return multiIds.game_ids?.length ? "game" : "round";
  }, [multiIds]);

  const [activeId, setActiveId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const ids = mode === "round" ? multiIds.round_ids : multiIds.game_ids;

  // 1. Set default active tab
  useEffect(() => {
    if (mode === "round" && multiIds.round_ids.length) {
      setActiveId(multiIds.round_ids[0]);
    } else if (mode === "game" && multiIds.game_ids.length) {
      setActiveId(multiIds.game_ids[0]);
    }
  }, [mode, multiIds]);

  // 2. Fetch data based on activeId
  const {
    data: roundData,
    isLoading: isFetchingData,
    isFetching,
    isError,
  } = useGetRoundDetails({
    game_id: mode === "game" ? activeId : "",
    round_id: mode === "round" ? activeId : "",
    user_id: mode === "game" && multiIds.user_id ? multiIds.user_id : "",
  });

  const isLoading = isFetchingData || isFetching;

  // 3. Generate derived data
  const roundOverviewData = useMemo(() => {
    if (!roundData) return null;
    return generateRoundOverview(roundData);
  }, [roundData]);

  const gameMetaData = useMemo(() => {
    // If roundData is null (loading new tab), return empty to clear previous state
    if (!roundData?.gameDetails) return [];
    return generateGameMetaData(roundData.gameDetails);
  }, [roundData]);

  // 4. Sync to global context
  useEffect(() => {
    if (roundData && !isLoading) {
      setRoundDetails(roundData);

      if (roundOverviewData) {
        setRoundOverview(roundOverviewData.roundOverview);
      }

      // UPDATED: Removed the 'mode === "game"' check so metadata
      // reloads for every round/game clicked.
      if (gameMetaData && gameMetaData.length > 0) {
        setGameMetadata(gameMetaData);
      }
    }
  }, [
    roundData,
    roundOverviewData,
    gameMetaData,
    isLoading,
    setRoundDetails,
    setRoundOverview,
    setGameMetadata,
  ]);

  // 5. Error handling
  useEffect(() => {
    if (isError) {
      toast.error(`Failed to fetch data for ID: ${activeId}`);
    }
  }, [isError, activeId]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleSelection(id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-3 w-3"
                  />

                  <div className="flex items-center gap-1 font-mono">
                    <span className="opacity-50">
                      {mode === "round" ? "R" : "G"}:
                    </span>
                    <span className="max-w-25">{id}</span>
                  </div>

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