"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { 
  $getNodeByKey, 
  KEY_DELETE_COMMAND, 
  KEY_BACKSPACE_COMMAND, 
  COMMAND_PRIORITY_LOW 
} from "lexical";
import { useEffect, useCallback } from "react";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";

export function FieldComponent({
  display,
  nodeKey,
}: {
  keyName: string;
  display: string;
  nodeKey: string;
}) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          node?.remove();
        });
        return true;
      }
      return false;
    },
    [editor, isSelected, nodeKey]
  );

  useEffect(() => {
    return editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW);
  }, [editor, onDelete]);

  useEffect(() => {
    return editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW);
  }, [editor, onDelete]);

  return (
    <span
      role="button"
      className={`mx-1 px-1.5 py-0.5 rounded border cursor-pointer select-none transition-all
        ${isSelected 
          ? "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300" 
          : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
        }`}
      onClick={(e) => {
        e.stopPropagation();
        if (!e.shiftKey) clearSelection();
        setSelected(!isSelected);
      }}
    >
      {display}
    </span>
  );
}