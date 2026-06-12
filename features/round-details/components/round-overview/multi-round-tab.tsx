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

  // Stringified version of ids allows us to reliably detect when a brand new search happens
  const idsKey = JSON.stringify(ids);

  // 1. RESET TRIGGER ON NEW SEARCH
  // When the user searches for new IDs, force-switch to the new first tab and wipe old selections
  useEffect(() => {
    if (ids && ids.length > 0) {
      const firstId = ids[0];
      setActiveId(firstId);
      
      // Clear out previous selections from the old search so they don't linger
      setSelectedRoundDetailsMap({});
    }
  }, [idsKey, setActiveId, setSelectedRoundDetailsMap]);

  // 2. DERIVE CURRENT EFFECTIVE ID SAFELY
  const currentActiveId = activeId || (ids && ids.length > 0 ? ids[0] : "");

  // 3. FETCH FOR THE FRESHLY ACTIVATED ID
  const {
    data: roundData,
    isLoading: isFetchingData,
    isFetching,
    isError,
  } = useGetRoundDetails({
    game_id: mode === "game" ? currentActiveId : "",
    round_id: mode === "round" ? currentActiveId : "",
    user_id: mode === "game" && multiIds.user_id ? multiIds.user_id : "",
  });

  const isLoading = isFetchingData || isFetching;

  // Unified keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || !ids.length || !currentActiveId) {
        return;
      }

      const currentIndex = ids.indexOf(currentActiveId);
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
    [ids, currentActiveId, setActiveId]
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
    if (roundData && !isLoading && currentActiveId) {
      setSelectedRoundDetailsMap((prevMap) => {
        if (currentActiveId in prevMap) {
          return {
            ...prevMap,
            [currentActiveId]: roundData,
          };
        }
        return prevMap;
      });
    }
  }, [roundData, isLoading, currentActiveId, setSelectedRoundDetailsMap]);

  useEffect(() => {
    if (isError && currentActiveId) {
      toast.error(`Failed to fetch data for ID: ${currentActiveId}`);
    }
  }, [isError, currentActiveId]);

  const handleCheckboxToggle = (id: string, isChecked: boolean) => {
    setSelectedRoundDetailsMap((prevMap) => {
      const nextMap = { ...prevMap };

      if (isChecked) {
        delete nextMap[id];
      } else {
        nextMap[id] = (id === currentActiveId && roundData && !isLoading)
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
        value={currentActiveId}
        onValueChange={setActiveId}
        className="max-h-full border w-full flex items-center justify-between rounded-xl bg-background px-1 py-1 shadow-sm p-0"
      >
        <TabsList className="flex flex-wrap h-auto w-full gap-1 p-1 justify-start bg-transparent">
          {ids.map((id) => {
            const isActive = currentActiveId === id;
            const isChecked = id in selectedRoundDetailsMap;
            
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