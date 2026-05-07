"use client";

import * as React from "react";

import { Roles } from "@/lib/excel-engine/rbac/roles/get-all";
import { getRolesColumn } from "./roles-columns";
import { RoleTable } from "./role-table";

type Props = {
  data: Roles[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (item: Roles) => void;
  onDelete: (id: number) => void;
};

export function RolesList({
  data,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const columns = React.useMemo(
    () => getRolesColumn({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <div className="rounded-md border bg-background">
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <div className="text-sm font-semibold">Roles</div>
      </div>

      <RoleTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        colSpan={4}
      />
    </div>
  );
}