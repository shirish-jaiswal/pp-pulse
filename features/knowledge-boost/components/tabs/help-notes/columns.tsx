"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { HelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/get-all";

type Props = {
  onEdit: (item: HelpNotes) => void;
  onDelete: (id: number) => void;
};

export const getHelpNotesColumns = ({
  onEdit,
  onDelete,
}: Props): ColumnDef<HelpNotes>[] => [
  {
  accessorKey: "notes",
  header: "Notes",
  cell: ({ row }) => (
    <div className="min-w-0">
      <div className="text-sm truncate">
        {row.original.notes}
      </div>
    </div>
  ),
},
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.priority}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableColumnFilter: false,
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