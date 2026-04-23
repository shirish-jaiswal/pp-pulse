import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get-all";

interface GetColumnsProps {
  onEdit: (res: ResolutionTemplate) => void;
}

const multiSelectFilter = <TData,>(
  row: any,
  columnId: string,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;

  const value = row.getValue(columnId);
  return filterValue.includes(value);
};

export const getColumns = ({
  onEdit,
}: GetColumnsProps): ColumnDef<ResolutionTemplate>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        #{row.getValue("id")}
      </span>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
    enableColumnFilter: false,
  },

  {
    accessorKey: "game",
    header: "Game",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("game")}</span>
    ),

    filterFn: multiSelectFilter,
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">
        {row.getValue("category")}
      </span>
    ),

    filterFn: multiSelectFilter,
  },

  {
    accessorKey: "subcategory",
    header: "Subcategory",
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">
        {row.getValue("subcategory")}
      </span>
    ),

    filterFn: multiSelectFilter,
  },

  {
    id: "actions",
    header: () => (
      <div className="text-right text-xs text-muted-foreground">
        Actions
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
];