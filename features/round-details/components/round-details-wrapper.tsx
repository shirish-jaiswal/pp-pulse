"use client";

import { useEffect, useState, useRef } from "react";

import { ResolutionEditor } from "@/features/round-details/components/resolution-sheet/resolution-editor";
import { RoundInvestigator } from "@/features/round-details/components/investigator/round-investigator";
import { MultiRoundTabs } from "@/features/round-details/components/round-overview/multi-round-tab";
import RoundOverview from "@/features/round-details/components/round-overview/round-overview";
import GameMetadata from "@/features/round-details/components/game-metadata/game-metadata";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import RoundAudit from "@/features/round-details/components/round-audit/round-audit";
import EmptyRoundData from "@/features/round-details/components/empty-round-data";
import { RoundFetchError } from "@/features/round-details/components/round-fetch-error";
import generateRoundOverview from "@/app/(dashboard)/round-activity/round-overview";
import { c_getRoundDetails } from "@/lib/api/round-details/c_round-details";
import RoundDetailsSkeleton from "@/features/round-details/components/round-details-skeleton";
import generateGameMetaData from "@/app/(dashboard)/round-activity/game-metadata";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type RoundDetailsWrapperProps = {
  roundId?: string;
  gameId?: string;
  userId?: string;
  isBulk?: boolean;
  roundIds?: string[];
};

export function RoundDetailsWrapper({
  roundId,
  gameId,
  userId,
  isBulk,
  roundIds,
}: RoundDetailsWrapperProps) {
  const {
    setRoundDetailsInput,
    isBulkMode,
    setBulkMode,
    roundDetails,
    setRoundDetails,
    setRoundOverview,
    setGameMetadata,
    setMultiIds,
  } = useRoundDetails();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastToastedIdRef = useRef<string | null>(null);

  // -----------------------------
  // Sync props → global context
  // -----------------------------
  useEffect(() => {
    setBulkMode(!!isBulk);

    if (isBulk && roundIds?.length) {
      setMultiIds({
        round_ids: roundIds,
        game_ids: [],
        user_id: userId || "",
      });
    } else {
      setRoundDetailsInput({
        round_id: roundId,
        game_id: gameId,
        user_id: userId,
      });
    }
  }, [
    roundId,
    gameId,
    userId,
    isBulk,
    roundIds,
    setRoundDetailsInput,
    setBulkMode,
    setMultiIds,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const activeRoundId =
        roundId || (isBulk && roundIds?.length ? roundIds[0] : null);

      const hasRequiredParams = activeRoundId || (gameId && userId);
      if (!hasRequiredParams) return;

      setLoading(true);
      setError(false);

      try {
        const payload = activeRoundId
          ? { round_id: activeRoundId }
          : { game_id: gameId, user_id: userId };

        const data = await c_getRoundDetails(payload);
        setRoundDetails(data);

        const overview = generateRoundOverview(data);
        setRoundOverview(overview?.roundOverview ?? []);
        const meta = generateGameMetaData(data?.gameDetails ?? []);
        setGameMetadata(meta);
      } catch (err) {
        setError(true);
        setRoundDetails(null);
        setRoundOverview(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    roundId,
    gameId,
    userId,
    isBulk,
    roundIds,
    setRoundDetails,
    setRoundOverview,
    setGameMetadata,
  ]);

  useEffect(() => {
    const walletType = roundDetails?.tptInfo?.[0]?.Wallet_Type?.toLowerCase();
    const currentRoundId = roundId || roundDetails?.tptInfo?.[0]?.round_id as string;

    if (walletType === "bt" && currentRoundId !== lastToastedIdRef.current) {
      toast.info("BT Operators dont have Slots Logs");
      lastToastedIdRef.current = currentRoundId;
    }

    if (!roundDetails) {
      lastToastedIdRef.current = null;
    }
  }, [roundDetails, roundId]);

  const cancelReason = roundDetails?.gameDetails?.[0]?.cancelReason;

  return (
    <div className="flex flex-col gap-2">
      <RoundInvestigator />

      {error && (
        <RoundFetchError
          roundId={roundId}
          gameId={gameId}
          userId={userId}
        />
      )}

      {/* Bulk Tabs */}
      {isBulkMode && <MultiRoundTabs />}

      {/* Loading */}
      {loading ? (
        <RoundDetailsSkeleton />
      ) : roundDetails ? (
        <>
          <GameMetadata />

          {cancelReason && (
            <div className="w-full flex justify-center">
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm w-full">
                <span className="font-semibold pb-1 mb-2">Cancel Reason :: </span><span className="font-mono"> </span> {cancelReason || "--"}
              </div>
            </div>
          )}

          <RoundOverview />
          <RoundAudit />
          <ResolutionEditor gameName={"All"} />
        </>
      ) : (
        <EmptyRoundData />
      )}
    </div>
  );
}