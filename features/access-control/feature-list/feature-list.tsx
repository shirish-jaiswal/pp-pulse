"use client";

import { FeatureListTemplate } from "@/lib/excel-engine/rbac/feature-list/get-all";
import * as React from "react";
import { getFeatureListColumns } from "./feature-list-columns";
import { FeatureListTable } from "./feature-list-table";


type Props = {
  data: FeatureListTemplate[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (item: FeatureListTemplate) => void;
  onDelete: (id: number) => void;
};

export function FeatureList({
  data,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const columns = React.useMemo(
    () => getFeatureListColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <div className="rounded-md border bg-background">
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <div className="text-sm font-semibold">Feature List</div>
      </div>

      <FeatureListTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        colSpan={4}
      />
    </div>
  );
}