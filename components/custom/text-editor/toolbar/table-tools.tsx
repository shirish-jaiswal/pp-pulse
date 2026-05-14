import { useState } from "react";
import {
  INSERT_TABLE_COMMAND,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $findTableNode,
} from "@lexical/table";
import { $getSelection, $isRangeSelection } from "lexical";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Table as TableIcon } from "lucide-react";

export function TableTools({ editor }: any) {
  const [hover, setHover] = useState({ r: 0, c: 0 });
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const insertTable = (r: number, c: number) => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: r,
      columns: c,
    });
  };

  const deleteTable = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const table = $findTableNode(selection.anchor.getNode());
        table?.remove();
      }
    });
  };

  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <TableIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>Table</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-72 p-3 space-y-3">
        {/* HEADER */}
        <div className="text-xs font-medium text-muted-foreground">
          Insert table
        </div>

        {/* GRID PICKER */}
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 5 }).map((_, c) => {
              const active = r < hover.r && c < hover.c;

              return (
                <button
                  key={`${r}-${c}`}
                  onMouseEnter={() => setHover({ r: r + 1, c: c + 1 })}
                  onClick={() => insertTable(r + 1, c + 1)}
                  className={`h-5 w-5 rounded-sm border transition ${
                    active
                      ? "bg-blue-500 border-blue-600"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                />
              );
            })
          )}
        </div>

        {/* LIVE SIZE DISPLAY */}
        <div className="text-xs text-muted-foreground">
          {hover.r || 1} × {hover.c || 1}
        </div>

        <div className="h-px bg-border" />

        {/* PRECISE CONTROLS (IMPORTANT ADDITION) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">Rows</p>
            <Input
              type="number"
              min={1}
              max={20}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">Cols</p>
            <Input
              type="number"
              min={1}
              max={20}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <Button
          className="w-full h-8 text-sm"
          onClick={() => insertTable(rows, cols)}
        >
          Insert custom table
        </Button>

        <div className="h-px bg-border" />

        {/* TABLE OPERATIONS */}
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="h-8 justify-start text-xs"
            onClick={() =>
              editor.update(() => $insertTableRowAtSelection())
            }
          >
            Add row
          </Button>

          <Button
            variant="ghost"
            className="h-8 justify-start text-xs"
            onClick={() =>
              editor.update(() => $insertTableColumnAtSelection())
            }
          >
            Add column
          </Button>

          <Button
            variant="ghost"
            className="h-8 justify-start text-xs text-red-500 hover:text-red-600"
            onClick={deleteTable}
          >
            Delete table
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}