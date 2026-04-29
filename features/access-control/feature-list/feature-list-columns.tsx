"use client";

import { FeatureListTemplate } from "@/lib/excel-engine/rbac/feature-list/get-all";
import type { ColumnDef } from "@tanstack/react-table";

type ColumnProps = {
  onEdit: (item: FeatureListTemplate) => void;
  onDelete: (id: number) => void;
};

export const getFeatureListColumns = ({
  onEdit,
  onDelete,
}: ColumnProps): ColumnDef<FeatureListTemplate>[] => [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="text-sm font-medium truncate">
          {row.original.title}
        </div>
      ),
    },

    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <span className="text-xs text-muted-foreground truncate">
            {value || "-"}
          </span>
        );
      },
    },

    {
      accessorKey: "group",
      header: "Group",
    },

    {
      accessorKey: "roles",
      header: "Roles",
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
      accessorKey: "created_at",
      header: "Created",
      cell: ({ getValue }) => {
        const value = getValue() as string | undefined;
        return (
          <span className="text-xs text-muted-foreground">
            {value ? new Date(value).toLocaleDateString() : "-"}
          </span>
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
            onClick={() => onDelete(row.original.id)}
            className="text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];