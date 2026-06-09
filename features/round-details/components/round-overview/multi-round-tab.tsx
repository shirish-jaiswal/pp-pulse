"use client";

import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import generateRoundOverview from "@/app/(dashboard)/round-activity/round-overview";
import useGetRoundDetails from "@/features/round-details/hook/use-get-round-details";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useEffect, useCallback } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import generateGameMetaData from "@/app/(dashboard)/round-activity/game-metadata";

type Mode = "round" | "game";

export function MultiRoundTabs() {
  const {
    multiIds,
    activeId,       
    setActiveId, 
    setRoundDetails,
    setRoundOverview,
    setGameMetadata,
    selectedRoundDetailsMap,
    setSelectedRoundDetailsMap,
  } = useRoundDetails();

  const mode: Mode = useMemo(() => {
    return multiIds.game_ids?.length ? "game" : "round";
  }, [multiIds]);

  const ids = mode === "round" ? multiIds.round_ids : multiIds.game_ids;

  // Automatically manage default active tab via global state triggers
  useEffect(() => {
    if (mode === "round" && multiIds.round_ids.length && !activeId) {
      setActiveId(multiIds.round_ids[0]);
    } else if (mode === "game" && multiIds.game_ids.length && !activeId) {
      setActiveId(multiIds.game_ids[0]);
    }
  }, [mode, multiIds, activeId, setActiveId]);

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

  // Unified keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || !ids.length || !activeId) {
        return;
      }

      const currentIndex = ids.indexOf(activeId);
      if (currentIndex === -1) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < ids.length) {
          setActiveId(ids[nextIndex]);
        } else {
          toast.info("You are at the last round.");
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          setActiveId(ids[prevIndex]);
        } else {
          toast.info("You are at the first round.");
        }
      }
    },
    [ids, activeId, setActiveId]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const roundOverviewData = useMemo(() => {
    if (!roundData) return null;
    return generateRoundOverview(roundData);
  }, [roundData]);

  const gameMetaData = useMemo(() => {
    if (!roundData?.gameDetails) return [];
    return generateGameMetaData(roundData.gameDetails);
  }, [roundData]);

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

  useEffect(() => {
    if (roundData && !isLoading && activeId) {
      setSelectedRoundDetailsMap((prevMap) => {
        if (activeId in prevMap) {
          return {
            ...prevMap,
            [activeId]: roundData,
          };
        }
        return prevMap;
      });
    }
  }, [roundData, isLoading, activeId, setSelectedRoundDetailsMap]);

  useEffect(() => {
    if (isError && activeId) {
      toast.error(`Failed to fetch data for ID: ${activeId}`);
    }
  }, [isError, activeId]);

  const handleCheckboxToggle = (id: string, isChecked: boolean) => {
    setSelectedRoundDetailsMap((prevMap) => {
      const nextMap = { ...prevMap };

      if (isChecked) {
        delete nextMap[id];
      } else {
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
        className="max-h-full border w-full flex items-center justify-between rounded-xl bg-background px-1 py-1 shadow-sm p-0"
      >
        <TabsList className="flex flex-wrap h-auto w-full gap-1 p-1 justify-start bg-transparent">
          {ids.map((id) => {
            const isActive = activeId === id;
            const isChecked = id in selectedRoundDetailsMap;
            
            // Check if this specific tab has valid cache data saved in the details map
            const isDataLoaded = !!selectedRoundDetailsMap[id] && Object.keys(selectedRoundDetailsMap[id]).length > 0;

            return (
              <TabsTrigger
                key={id}
                value={id}
                className={cn(
                  "flex items-center gap-2 px-1.5 py-1.5 text-xs rounded-md transition whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-muted text-foreground border border-neutral-950 shadow-sm shadow-muted-foreground/50"
                    : "text-muted-foreground hover:bg-muted/50 data-[state=active]:bg-muted",
                  // Visual accent for loaded tabs that are not currently active
                  isDataLoaded && !isActive && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-transparent hover:bg-emerald-500/20"
                )}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => {
                    if (!isChecked) {
                      setActiveId(id);
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

                {/* SHOW SPINNER IF LOADING */}
                {isLoading && isActive && (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                )}

                {/* SHOW GREEN CHECK ICON IF FULLY LOADED & CACHED */}
                {isDataLoaded && !isLoading && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}