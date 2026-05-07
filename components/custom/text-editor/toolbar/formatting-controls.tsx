import { useEffect, useState, useCallback } from "react";
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline } from "lucide-react";

export function FormattingControls({ editor }: any) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }: any) => {
        editorState.read(updateToolbar);
      }),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
        updateToolbar();
        return false;
      }, 1)
    );
  }, [editor, updateToolbar]);

  return (
    <div className="flex items-center gap-0.5">
      <Toggle size="sm" pressed={isBold}
        onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle size="sm" pressed={isItalic}
        onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle size="sm" pressed={isUnderline}
        onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  );
}