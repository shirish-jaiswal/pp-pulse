"use client";

import { FeatureListTemplate } from "@/lib/excel-engine/rbac/feature-list/get-all";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Pencil, Trash2 } from "lucide-react";

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
      <div className="font-medium text-sm truncate max-w-[180px]">
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
        <span className="text-xs text-muted-foreground">
          {value || "-"}
        </span>
      );
    },
  },

  {
    accessorKey: "group",
    header: "Group",
    cell: ({ getValue }) => (
      <span className="text-xs">{(getValue() as string) || "-"}</span>
    ),
  },

  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;

      if (!value) return <span className="text-xs text-muted-foreground">-</span>;

      const roles = value.split(",").map((r) => r.trim());

      return (
        <div className="flex flex-wrap gap-1 max-w-[220px]">
          {roles.slice(0, 3).map((role) => (
            <Badge key={role} variant="secondary" className="text-[10px]">
              {role}
            </Badge>
          ))}

          {roles.length > 3 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-[10px] cursor-pointer">
                  +{roles.length - 3}
                </Badge>
              </TooltipTrigger>

              <TooltipContent className="text-xs">
                {roles.join(", ")}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
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
              onClick={() => onDelete(row.original.id)}
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