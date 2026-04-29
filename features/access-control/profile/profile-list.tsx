"use client";

import * as React from "react";

import type { Profile } from "@/lib/excel-engine/rbac/profile/get-all";

import { getProfileColumns } from "./profile-columns";
import { ProfileTable } from "./profile-table";

type Props = {
  data: Profile[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (item: Profile) => void;
  onDelete: (id: number) => void;
};

export function ProfileList({
  data,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const columns = React.useMemo(
    () => getProfileColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <div className="rounded-md border bg-background">
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <div className="text-sm font-semibold">Profile List</div>
      </div>

      <ProfileTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        colSpan={5}
      />
    </div>
  );
}