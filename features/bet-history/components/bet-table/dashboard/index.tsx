"use client";

import { useMemo } from "react";
import { columns, getSelectionColumn } from "@/features/bet-history/components/bet-table/dashboard/columns";
import { useBetHistory } from "@/features/bet-history/context/bet-history-context";
import { RoundRow, transformToRounds } from "@/features/bet-history/components/bet-table/transform-bets";
import { DataTable } from "@/features/bet-history/components/bet-table/dashboard/data-table";


export default function DashboardPage() {
  const { data } = useBetHistory();
  const tableColumns = [getSelectionColumn<RoundRow>(), ...columns];
  const transformedData = useMemo(() => {
    return transformToRounds(data);
  }, [data]);

  return (
    <div className="p-1">
      <DataTable columns={tableColumns} data={transformedData} />
    </div>
  );
}