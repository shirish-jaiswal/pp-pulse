"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND
} from "lexical";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { INSERT_TABLE_COMMAND, $insertTableRowAtSelection, $insertTableColumnAtSelection, $deleteTableRowAtSelection, $deleteTableColumnAtSelection, $findTableNode } from "@lexical/table";
import { mergeRegister } from "@lexical/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Bold, Italic, Underline, Link, Table as TableIcon, Undo2, Redo2, Plus, Trash2, Rows, Columns, Image as ImageIcon } from "lucide-react";
import { Toggle } from "../../ui/toggle";
import { INSERT_IMAGE_COMMAND } from "./image-commands";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [tableConfig, setTableConfig] = useState({ rows: "3", cols: "3" });
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

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
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateToolbar());
      }),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
        updateToolbar();
        return false;
      }, 1)
    );
  }, [editor, updateToolbar]);

  const insertTable = () => editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: tableConfig.rows, columns: tableConfig.cols });
  const deleteTable = () => editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const tableNode = $findTableNode(selection.anchor.getNode());
      tableNode?.remove();
    }
  });

  const insertImage = () => {
    if (imageUrl) {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: imageUrl, altText: imageAlt });
      setImageUrl("");
      setImageAlt("");
    }
  };

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex items-center gap-1 p-1 border rounded-t-md bg-background border-b-0 flex-wrap">

        {/* Undo / Redo */}
        <ToolbarButton tooltip="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}><Undo2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton tooltip="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}><Redo2 className="h-4 w-4" /></ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Text formatting */}
        <Toggle size="sm" pressed={isBold} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} aria-label="Bold"><Bold className="h-4 w-4" /></Toggle>
        <Toggle size="sm" pressed={isItalic} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} aria-label="Italic"><Italic className="h-4 w-4" /></Toggle>
        <Toggle size="sm" pressed={isUnderline} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} aria-label="Underline"><Underline className="h-4 w-4" /></Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Popover>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Link className="h-4 w-4" /></Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>Insert Link</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80 p-3">
            <div className="flex gap-2">
              <Input placeholder="https://example.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
              <Button size="sm" onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Popover>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>Insert Image</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80 p-3">
            <div className="flex flex-col gap-2">
              {/* URL Input */}
              <Input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <Input placeholder="Alt text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} />
              <Button size="sm" onClick={insertImage}>Insert URL</Button>

              <Separator />

              <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const src = reader.result as string;
                        editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText: file.name });
                      };
                      reader.readAsDataURL(file);
                      e.target.value = ""; // reset input
                    }
                  }}
                />
              </label>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Popover>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 flex gap-2">
                  <TableIcon className="h-4 w-4" /> <span className="text-xs font-medium">Table</span>
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>Table Settings</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-48 p-3">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Rows" value={tableConfig.rows} onChange={(e) => setTableConfig({ ...tableConfig, rows: e.target.value })} />
                <Input type="number" placeholder="Cols" value={tableConfig.cols} onChange={(e) => setTableConfig({ ...tableConfig, cols: e.target.value })} />
              </div>
              <Button size="sm" className="w-full" onClick={insertTable}>Insert Table</Button>
              <Separator />
              <div className="grid grid-cols-2 gap-1">
                <Button variant="outline" size="xs" onClick={() => editor.update(() => $insertTableRowAtSelection())}><Rows className="mr-1 h-3 w-3" />+ Row</Button>
                <Button variant="outline" size="xs" onClick={() => editor.update(() => $insertTableColumnAtSelection())}><Columns className="mr-1 h-3 w-3" />+ Col</Button>
              </div>
              <Button variant="destructive" size="sm" onClick={deleteTable} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Table
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}

function ToolbarButton({ children, onClick, tooltip }: { children: React.ReactNode; onClick: () => void; tooltip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClick}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}