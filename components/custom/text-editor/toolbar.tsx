"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $getRoot
} from "lexical";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  INSERT_TABLE_COMMAND,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $findTableNode
} from "@lexical/table";
import { mergeRegister } from "@lexical/utils";
import { $generateHtmlFromNodes } from "@lexical/html";

// UI Components (Assumes shadcn/ui components are in @/components/ui)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";

// Icons
import {
  Bold, Italic, Underline, Link, Table as TableIcon, Undo2, Redo2,
  Trash2, Rows, Columns, Image as ImageIcon, Check, Copy, ChevronDown
} from "lucide-react";

import { INSERT_IMAGE_COMMAND } from "@/components/custom/text-editor/image-commands";
import { FieldDropdown } from "./field-dropdown";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [tableConfig, setTableConfig] = useState({ rows: "3", cols: "3" });
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [copied, setCopied] = useState(false);

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

  const handleCopy = useCallback(async () => {
    editor.getEditorState().read(async () => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      const textString = $getRoot().getTextContent();

      try {
        const data = [
          new ClipboardItem({
            "text/html": new Blob([htmlString], { type: "text/html" }),
            "text/plain": new Blob([textString], { type: "text/plain" }),
          }),
        ];
        await navigator.clipboard.write(data);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    });
  }, [editor]);

  const insertTable = () => editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: tableConfig.rows, columns: tableConfig.cols });

  const deleteTable = () => editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const tableNode = $findTableNode(selection.anchor.getNode());
      tableNode?.remove();
    }
  });

  return (
    <TooltipProvider delayDuration={400}>
      <div className="sticky top-0 z-20 flex items-center justify-between w-full p-1.5 bg-background border-b border-border rounded-t-xl shadow-sm min-h-11">
        <div className="flex items-center gap-0.5 flex-wrap">

          {/* Group 1: History */}
          <div className="flex items-center">
            <ToolbarButton tooltip="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton tooltip="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          {/* Group 2: Formatting */}
          <div className="flex items-center gap-0.5">
            <Toggle
              size="sm"
              pressed={isBold}
              onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
              className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary h-8 w-8 p-0"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={isItalic}
              onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
              className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary h-8 w-8 p-0"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={isUnderline}
              onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
              className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary h-8 w-8 p-0"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          {/* Group 3: Insert Tools (Links, Images, Tables) */}
          <div className="flex items-center gap-0.5">
            <Popover>
              <Tooltip>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Link className="h-4 w-4 text-muted-foreground" /></Button>
                  </TooltipTrigger>
                </PopoverTrigger>
                <TooltipContent>Insert Link</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-80 p-3 shadow-xl z-100" sideOffset={8}>
                <div className="flex gap-2">
                  <Input placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="h-8 text-sm" />
                  <Button size="sm" onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)}>Apply</Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <Tooltip>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ImageIcon className="h-4 w-4 text-muted-foreground" /></Button>
                  </TooltipTrigger>
                </PopoverTrigger>
                <TooltipContent>Image</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-80 p-4 flex flex-col gap-3 shadow-xl z-100" sideOffset={8}>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Image URL</p>
                  <Input placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="h-8" />
                  <Input placeholder="Alt text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} className="h-8" />
                  <Button size="sm" className="w-full" onClick={() => {
                    if (imageUrl) {
                      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: imageUrl, altText: imageAlt });
                      setImageUrl(""); setImageAlt("");
                    }
                  }}>Add to Editor</Button>
                </div>
                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-background px-2 text-muted-foreground">or upload</span></div>
                </div>
                <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent hover:border-primary/50 transition-all">
                  <span className="text-xs text-muted-foreground font-medium">Click to select file</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: reader.result as string, altText: file.name });
                      reader.readAsDataURL(file);
                      e.target.value = "";
                    }
                  }}
                  />
                </label>
              </PopoverContent>
            </Popover>

            <Popover>
              <Tooltip>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2 flex gap-1.5 items-center hover:bg-accent">
                      <TableIcon className="h-4 w-4 text-muted-foreground" />
                      <ChevronDown className="h-3 w-3 text-muted-foreground/40" />
                    </Button>
                  </TooltipTrigger>
                </PopoverTrigger>
                <TooltipContent>Table Tools</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-56 p-3 shadow-xl z-100" sideOffset={8}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground mb-1">Rows</p>
                      <Input type="number" value={tableConfig.rows} onChange={(e) => setTableConfig({ ...tableConfig, rows: e.target.value })} className="h-8" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground mb-1">Cols</p>
                      <Input type="number" value={tableConfig.cols} onChange={(e) => setTableConfig({ ...tableConfig, cols: e.target.value })} className="h-8" />
                    </div>
                  </div>
                  <Button size="sm" className="w-full" onClick={insertTable}>Insert Grid</Button>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => editor.update(() => $insertTableRowAtSelection())}><Rows className="mr-1 h-3 w-3" />Row</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => editor.update(() => $insertTableColumnAtSelection())}><Columns className="mr-1 h-3 w-3" />Col</Button>
                  </div>
                  <Button variant="destructive" size="sm" onClick={deleteTable} className="w-full h-8 text-xs">
                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Table
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          {/* Group 4: Custom Fields */}
          <div className="flex items-center">
            <FieldDropdown />
          </div>
        </div>

        {/* Action Section (Right Side) */}
        <div className="flex items-center gap-2 ml-auto pl-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`
              h-8 flex items-center gap-2 px-3 rounded-md border transition-all duration-300
              ${copied
                ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                : "border-transparent text-muted-foreground hover:text-primary hover:bg-accent"
              }
            `}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Copy HTML</span>
              </>
            )}
          </Button>
        </div>

      </div>
    </TooltipProvider>
  );
}

function ToolbarButton({ children, onClick, tooltip }: { children: React.ReactNode; onClick: () => void; tooltip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}