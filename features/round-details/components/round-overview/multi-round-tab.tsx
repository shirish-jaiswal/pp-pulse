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
    setGameMetadata,
    selectedRoundDetailsMap,    // Read directly from here
    setSelectedRoundDetailsMap, // Write directly to here
  } = useRoundDetails();

  const mode: Mode = useMemo(() => {
    return multiIds.game_ids?.length ? "game" : "round";
  }, [multiIds]);

  const [activeId, setActiveId] = useState<string>("");

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
    if (!roundData?.gameDetails) return [];
    return generateGameMetaData(roundData.gameDetails);
  }, [roundData]);

  // 4. Sync single active tab payload to global UI panels
  useEffect(() => {
    if (roundData && !isLoading) {
      setRoundDetails(roundData);

      if (roundOverviewData) {
        setRoundOverview(roundOverviewData.roundOverview);
      }

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

  // 5. Safe, deferred async effect to capture lazy-loaded data into your context map
  useEffect(() => {
    if (roundData && !isLoading) {
      setSelectedRoundDetailsMap((prevMap) => {
        // If this active ID is present in our dictionary keys but contains empty/stale layout data, update it safely.
        if (activeId in prevMap && prevMap[activeId] !== roundData) {
          return {
            ...prevMap,
            [activeId]: roundData,
          };
        }
        return prevMap;
      });
    }
  }, [roundData, isLoading, activeId, setSelectedRoundDetailsMap]);

  // 6. Error handling
  useEffect(() => {
    if (isError) {
      toast.error(`Failed to fetch data for ID: ${activeId}`);
    }
  }, [isError, activeId]);

  // 7. Directly alter the context map dictionary on checkbox interactions
  const handleCheckboxToggle = (id: string, currentlyChecked: boolean) => {
    setSelectedRoundDetailsMap((prevMap) => {
      const nextMap = { ...prevMap };

      if (currentlyChecked) {
        // Unchecking: drop the key instantly
        delete nextMap[id];
      } else {
        // Checking: initialize key slot. If active data is present, cache it now;
        // otherwise, give it a temporary structure until the network hook populates it.
        nextMap[id] = (id === activeId && roundData && !isLoading)
          ? roundData
          : ({} as any);
      }

      return nextMap;
    });
  };

  if (!ids.length) return null;

  return (
    <div className="w-full bg-background/40">
      <Tabs
        value={activeId}
        onValueChange={setActiveId}
        className="max-h-full border w-full flex items-center justify-between rounded-xl bg-background px-3 py-2 shadow-sm p-0"
      >
        <TabsList className="flex flex-wrap h-auto w-full gap-1 p-2 justify-start bg-transparent">
          {ids.map((id) => {
            const isActive = activeId === id;

            // CRITICAL CHANGE: Derive checked state instantly from global keys
            const isChecked = id in selectedRoundDetailsMap;

            return (
              <TabsTrigger
                key={id}
                value={id}
                asChild
                className="data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-neutral-950 rounded-md data-[state=active]:shadow-sm data-[state=active]:shadow-muted-foreground/50"
              >
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition whitespace-nowrap",
                    isActive
                      ? "bg-muted text-foreground hover:bg-muted/50 border-2 border-neutral-950"
                      : "text-muted-foreground hover:bg-muted/50",
                    "cursor-pointer"
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => {
                      if (!isChecked) {
                        setActiveId(id); // Shift focus to target lazy query fetching
                      }
                      handleCheckboxToggle(id, isChecked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-3 w-3"
                  />

                  <div className="flex items-center gap-1 font-mono">
                    <span className="opacity-50">
                      {mode === "round" ? "R" : "G"}:
                    </span>
                    <span className="truncate max-w-25">{id}</span>
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