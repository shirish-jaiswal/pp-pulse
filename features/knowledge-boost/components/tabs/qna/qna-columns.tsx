"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";

type ColumnProps = {
  onEdit: (item: QNA) => void;
  onDelete: (id: number) => void;
};

export const getQnaColumns = ({
  onEdit,
  onDelete,
}: ColumnProps): ColumnDef<QNA>[] => [
  {
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">
          {row.original.question}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {row.original.answer}
        </div>
      </div>
    ),
  },

  {
    accessorKey: "priority",
    header: "Priority",
  },

  {
    accessorKey: "options",
    header: "Options",
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;

      if (!value) {
        return <span className="text-xs text-muted-foreground">-</span>;
      }

      const isLong = value.length > 50;

      return (
        <div className="group relative">
          <span className="text-xs text-muted-foreground">
            {isLong ? value.slice(0, 50) + "..." : value}
          </span>

          {isLong && (
            <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 bg-black text-white text-xs p-2 rounded shadow max-w-xs whitespace-pre-wrap">
              {value}
            </div>
          )}
        </div>
      );
    },
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