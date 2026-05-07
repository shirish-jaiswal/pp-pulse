"use client";

import { useRoundDetails } from "@/features/round-details/context/round-details-context";

export function useBulkRoundNavigation(selectedRows: any[]) {
  const { setMultiIds } = useRoundDetails();

  const handleOpenBulk = () => {
    const roundIds = selectedRows
      .map((row) => row.original?.roundId)
      .filter(Boolean);

    if (!roundIds.length) return;

    setMultiIds({
      round_ids: roundIds,
      game_ids: [],
      user_id: "",
    });

    const params = new URLSearchParams();
    params.set("roundIds", roundIds.join(","));
    params.set("isBulk", "true");

    window.open(`/portal/round-activity/?${params.toString()}`, "_blank");
  };

  return { handleOpenBulk };
}