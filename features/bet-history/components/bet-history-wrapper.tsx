"use client";

import { useEffect } from "react";
import { BetHistoryProvider, useBetHistory } from "@/features/bet-history/context/bet-history-context";
import { usePlayerBetHistory } from "@/features/bet-history/hooks/use-player-bet-history";
import BetHistorySkeleton from "@/features/bet-history/components/bet-history-skeleton";
import { BetHistoryInvestigator } from "@/features/bet-history/components/investigator/bet-history-investigator";
import DashboardPage from "@/features/bet-history/components/bet-table/dashboard";

function BetHistoryContent() {
  const { input, setLoading, setError, setData } = useBetHistory();

  const params = {
    playerId: input.playerId || "",
    from: input.from || "",
    to: input.to || "",
  };

  const shouldFetch = Boolean(input.playerId);

  const { data, loading, error } = usePlayerBetHistory(
    params,
    shouldFetch ? 30000 : undefined
  );

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    setError(Boolean(error));
  }, [error, setError]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setData(data);
    }
  }, [data, setData]);

  return (
    <div className="flex flex-col gap-1">
      <BetHistoryInvestigator />

      {error && (
        <div className="text-red-500 text-sm">
          Failed to fetch bet history
        </div>
      )}

      {loading ? (
        <BetHistorySkeleton />
      ) : (
        <DashboardPage />
      )}
    </div>
  );
}

export function BetHistoryWrapper(props: any) {
  return (
    <BetHistoryProvider initialInput={props}>
      <BetHistoryContent />
    </BetHistoryProvider>
  );
}