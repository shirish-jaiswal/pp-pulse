import { UNDO_COMMAND, REDO_COMMAND } from "lexical";
import { Undo2, Redo2 } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";

export function HistoryControls({ editor }: any) {
  return (
    <div className="flex items-center">
      <ToolbarButton tooltip="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton tooltip="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}