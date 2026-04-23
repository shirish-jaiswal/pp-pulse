import { useState } from "react";
import {
  INSERT_TABLE_COMMAND,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $findTableNode
} from "@lexical/table";
import { $getSelection, $isRangeSelection } from "lexical";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table as TableIcon } from "lucide-react";

export function TableTools({ editor }: any) {
  const [rows, setRows] = useState("3");
  const [cols, setCols] = useState("3");

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
            <Button variant="ghost" size="sm">
              <TableIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>Table</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-56 space-y-2">
        <Input value={rows} onChange={(e) => setRows(e.target.value)} />
        <Input value={cols} onChange={(e) => setCols(e.target.value)} />

        <Button
          onClick={() =>
            editor.dispatchCommand(INSERT_TABLE_COMMAND, {
              rows,
              columns: cols,
            })
          }
        >
          Insert Table
        </Button>

        <Button onClick={() => editor.update(() => $insertTableRowAtSelection())}>
          Add Row
        </Button>

        <Button onClick={() => editor.update(() => $insertTableColumnAtSelection())}>
          Add Column
        </Button>

        <Button variant="destructive" onClick={deleteTable}>
          Delete Table
        </Button>
      </PopoverContent>
    </Popover>
  );
}