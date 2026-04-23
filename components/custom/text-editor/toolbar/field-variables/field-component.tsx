"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNodeByKey,
  $createTextNode,
  KEY_DELETE_COMMAND,
  KEY_BACKSPACE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { useEffect, useCallback, useState, useRef } from "react";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditing && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        cancelEdit();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  const replaceWithValue = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!node) return;
      const textNode = $createTextNode(value || display);
      node.replace(textNode);
    });
    setIsEditing(false);
  }, [editor, nodeKey, value, display]);

  const cancelEdit = () => {
    setIsEditing(false);
    setValue("");
  };

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setValue("");
    setIsEditing(true);
    if (!("shiftKey" in e) || !e.shiftKey) clearSelection();
    setSelected(true);
  };

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

  useEffect(() => editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW), [editor, onDelete]);
  useEffect(() => editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW), [editor, onDelete]);

  if (isEditing) {
    return (
      <span ref={wrapperRef} className="inline-flex items-center gap-1">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-6 text-sm px-1 border-b border-gray-300 focus:ring-0 focus:border-primary"
          placeholder={display}
          onKeyDown={(e) => {
            if (e.key === "Enter") replaceWithValue();
            if (e.key === "Escape") cancelEdit();
          }}
        />
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-1 text-xs"
          onClick={replaceWithValue}
        >
          OK
        </Button>
      </span>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="xs"
      className="
    inline-flex items-center 
    bg-white dark:bg-gray-800 
    border border-gray-300 dark:border-gray-600 
    rounded-md px-2 py-1 
    text-sm font-medium text-gray-800 dark:text-gray-100
    shadow-sm hover:shadow-md
    transition-all duration-200
    hover:scale-105
  "
      onClick={handleClick}
    >
      {display}
    </Button>
  );
}