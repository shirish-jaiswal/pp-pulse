"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Profile } from "@/lib/excel-engine/rbac/profile/get-all";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Pencil, Trash2 } from "lucide-react";

type ColumnProps = {
  onEdit: (item: Profile) => void;
  onDelete: (id: number) => void;
};

export const getProfileColumns = ({
  onEdit,
  onDelete,
}: ColumnProps): ColumnDef<Profile>[] => [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">
          {row.original.name}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {row.original.email}
        </div>
      </div>
    ),
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;

      if (!value) {
        return <span className="text-xs text-muted-foreground">-</span>;
      }

      const roles = value.split(",").map((r) => r.trim());

      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {roles.slice(0, 2).map((role) => (
            <Badge key={role} variant="secondary" className="text-[10px]">
              {role}
            </Badge>
          ))}

          {roles.length > 2 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-[10px] cursor-pointer">
                  +{roles.length - 2}
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
    accessorKey: "settings",
    header: "Settings",
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;

      return value ? (
        <Badge variant="outline" className="text-[10px]">
          Configured
        </Badge>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
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