"use client";

import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

import { $generateHtmlFromNodes } from "@lexical/html";
import { $getRoot } from "lexical";
import { HistoryControls } from "./history-controls";
import { FormattingControls } from "./formatting-controls";
import { InsertControls } from "./insert-controls";
import { FieldDropdown } from "./field-variables/field-dropdown";
import { CopyHtmlButton } from "./copy-html/copy-html-button";
import { LogTogglePlugin } from "./logs/log-toggle-plugin";

interface ToolbarProps {
  copyPopup?: boolean;
  showFieldPlugin?: boolean;
  showLogsToggle?: boolean
}

export function Toolbar({ copyPopup, showFieldPlugin, showLogsToggle }: ToolbarProps) {
  const [editor] = useLexicalComposerContext();

  return (
    <TooltipProvider delayDuration={400}>
      <div className="sticky top-0 z-20 flex items-center justify-between w-full p-1.5 bg-background border-b border-border rounded-t-xl shadow-sm min-h-11">

        <div className="flex items-center gap-0.5 flex-wrap">
          <HistoryControls editor={editor} />

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          <FormattingControls editor={editor} />

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          <InsertControls editor={editor} />

          {showFieldPlugin && (
            <>
              <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />
              <FieldDropdown />
            </>
          )}
        </div>
        <div className="flex">
          {showLogsToggle && (
            <LogTogglePlugin />
          )}
          <CopyHtmlButton
            copyPopup={copyPopup}
            getHtml={async () => {
              const html = await editor.getEditorState().read(() =>
                $generateHtmlFromNodes(editor, null)
              );

              const text = editor.getEditorState().read(() =>
                $getRoot().getTextContent()
              );

              return { html, text };
            }}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}