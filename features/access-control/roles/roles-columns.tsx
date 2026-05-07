"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Roles } from "@/lib/excel-engine/rbac/roles/get-all";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Pencil, Trash2 } from "lucide-react";

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
    header: "ID",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="text-[10px]">
        #{getValue() as number}
      </Badge>
    ),
  },

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue }) => (
      <span className="text-sm font-medium">
        {(getValue() as string) || "-"}
      </span>
    ),
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(row.original.id as number)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];