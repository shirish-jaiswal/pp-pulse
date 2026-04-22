"use client";

import { useMemo, useState } from "react";
import { Filters } from "@/features/bet-history/components/bet-table/dashboard/filters";
import { DataTable } from "@/features/bet-history/components/bet-table/dashboard/data-table";
import { columns } from "@/features/bet-history/components/bet-table/dashboard/columns";
import { useBetHistory } from "@/features/bet-history/context/bet-history-context";
import { transformToRounds } from "@/features/bet-history/components/bet-table/transform-bets";

export default function DashboardPage() {
  const { data } = useBetHistory();

  const [gameId, setGameId] = useState("all");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    let transformed = transformToRounds(data);

    if (gameId !== "all") {
      transformed = transformed.filter((r) => r.gameId === gameId);
    }

    if (status !== "all") {
      transformed = transformed.filter((r) => r.status === status);
    }

    return transformed;
  }, [data, gameId, status]);

  return (
    <div className="p-1">
      <Filters
        gameId={gameId}
        setGameId={setGameId}
        status={status}
        setStatus={setStatus}
      />

      <DataTable columns={columns} data={rows} />
    </div>
  );
}