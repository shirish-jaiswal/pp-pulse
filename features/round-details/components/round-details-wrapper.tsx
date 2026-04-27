"use client";

import { useEffect, useState, useRef } from "react";

import { ResolutionEditor } from "@/features/round-details/components/resolution-sheet/resolution-editor";
import { RoundInvestigator } from "@/features/round-details/components/investigator/round-investigator";
import { MultiRoundTabs } from "@/features/round-details/components/round-overview/multi-round-tab";
import RoundOverview from "@/features/round-details/components/round-overview/round-overview";
import GameMetadata from "@/features/round-details/components/round-overview/game-metadata";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import RoundAudit from "@/features/round-details/components/round-audit/round-audit";
import EmptyRoundData from "@/features/round-details/components/empty-round-data";
import { RoundFetchError } from "@/features/round-details/components/round-fetch-error";
import generateRoundOverview from "@/app/(dashboard)/round-activity/round-overview";
import { c_getRoundDetails } from "@/lib/api/round-details/c_round-details";
import RoundDetailsSkeleton from "./round-details-skeleton";
import generateGameMetaData from "@/app/(dashboard)/round-activity/game-metadata";
import { toast } from "sonner";

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
    roundDetailsInput,
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

  // Use a ref to track the last processed round ID to prevent double toasts
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

  // -----------------------------
  // Fetch Data
  // -----------------------------
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

        // safe overview generation
        const overview = generateRoundOverview(data);
        setRoundOverview(overview?.roundOverview ?? []);

        // safe metadata generation
        const meta = generateGameMetaData(data?.gameDetails ?? []);
        setGameMetadata(meta);
      } catch (err) {
        console.error("Failed to fetch round details:", err);
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

  // -----------------------------
  // Logic: Handle Toast Notification
  // -----------------------------
  useEffect(() => {
    const walletType = roundDetails?.tptInfo?.[0]?.Wallet_Type?.toLowerCase();

    // We use either the specific roundId prop or the ID from the fetched data
    const currentRoundId = roundId || roundDetails?.tptInfo?.[0]?.round_id as string;

    if (walletType === "bt" && currentRoundId !== lastToastedIdRef.current) {
      toast.info("BT operator No Slots Logs");
      lastToastedIdRef.current = currentRoundId;
    }

    // If roundDetails is cleared, reset the ref so the next fetch can trigger a toast
    if (!roundDetails) {
      lastToastedIdRef.current = null;
    }
  }, [roundDetails, roundId]);

  // -----------------------------
  // Cancel Reason (UI block)
  // -----------------------------
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

          {/* Cancel Reason (centered + red) */}
          {cancelReason && (
            <div className="w-full flex justify-center">
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded-md text-sm font-medium">
                {cancelReason}
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