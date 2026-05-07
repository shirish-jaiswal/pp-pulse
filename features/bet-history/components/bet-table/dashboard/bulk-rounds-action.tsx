"use client";

import { Button } from "@/components/ui/button";
import { useBulkRoundNavigation } from "@/features/bet-history/hooks/handleOpenBulk";

type Props = {
  selectedRows: any[];
};

export function BulkRoundsAction({ selectedRows }: Props) {
  const selectedCount = selectedRows.length;

  const { handleOpenBulk } = useBulkRoundNavigation(selectedRows);

  return (
    <div className="flex items-center gap-2">
      <Button disabled={!selectedCount} size="sm" onClick={handleOpenBulk}>
        Open Selected ({selectedCount})
      </Button>
    </div>
  );
}