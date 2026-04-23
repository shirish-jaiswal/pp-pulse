import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get-all";

interface ColumnProps {
  onEdit: (res: ResolutionTemplate) => void;
  onDelete: (id: number) => void;
}

const includesMultiple = (row: any, columnId: string, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const value = row.getValue(columnId);
  return filterValue.includes(value);
};

export const getResolutionColumns = ({
  onEdit,
  onDelete,
}: ColumnProps): ColumnDef<ResolutionTemplate>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableColumnFilter: false,
  },

  {
    accessorKey: "title",
    header: "Title",
  },

  {
    accessorKey: "game",
    header: "Game",
    filterFn: includesMultiple,
    enableColumnFilter: true,
  },

  {
    accessorKey: "category",
    header: "Category",
    filterFn: includesMultiple,
    enableColumnFilter: true,
  },

  {
    accessorKey: "subcategory",
    header: "Subcategory",
    filterFn: includesMultiple,
    enableColumnFilter: true,
  },

  {
    id: "actions",
    header: "Actions",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const res = row.original;

      return (
        <div className="text-right space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(res)}>
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
            onClick={() => onDelete(res.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];