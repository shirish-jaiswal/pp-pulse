"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Roles } from "@/lib/excel-engine/rbac/roles/get-all";

type ColumnProps = {
  onEdit: (item: Roles) => void;
  onDelete: (id: number) => void;
};

export const getRolesColumn = ({
  onEdit,
  onDelete,
}: ColumnProps): ColumnDef<Roles>[] => [

  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end gap-3">
        <button
          onClick={() => onEdit(row.original)}
          className="text-xs text-blue-600 hover:underline"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(row.original.id as number)}
          className="text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    ),
  },
];