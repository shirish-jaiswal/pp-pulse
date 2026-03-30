"use client";

import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { LinkNode } from "@lexical/link";
import { $getRoot } from "lexical";

import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

import { ImageNode } from "@/components/custom/text-editor/image-node";
import { Toolbar } from "@/components/custom/text-editor/toolbar";
import ImagesPlugin from "@/components/custom/text-editor/image-plugin";

export default function RichTextEditor({
  onChange,
  placeholder = "Start typing...",
  initialValue,
}: {
  onChange?: (val: string) => void;
  placeholder?: string;
  initialValue?: string; // JSON string
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const theme = {
    paragraph: "mb-2",
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
      strikethrough: "line-through",
    },
    link: "text-blue-600 underline",
    table: "border-collapse border border-gray-400 w-full my-4",
    tableCell: "border border-gray-400 p-2 min-w-[50px]",
    tableRow: "hover:bg-gray-50",
  };

  const editorConfig = {
    namespace: "Editor",
    theme,
    nodes: [
      HeadingNode,
      QuoteNode,
      TableNode,
      TableRowNode,
      TableCellNode,
      LinkNode,
      ImageNode,
    ],
    onError: (e: Error) => console.error(e),

    editorState: (editor: any) => {
      if (initialValue) {
        try {
          const parsedState = editor.parseEditorState(initialValue);
          editor.setEditorState(parsedState);
        } catch (e) {
          console.error("Invalid editor state", e);
        }
      }
    },
  };

  if (!mounted) return null;

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="border rounded-md shadow-sm bg-white overflow-hidden max-w-4xl mx-auto">
        
        <Toolbar />

        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="h-[480px] p-4 outline-none overflow-auto" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />
        <LinkPlugin />
        <TablePlugin />
        <ImagesPlugin />

        {/* ✅ SAVE FULL JSON STATE */}
        <OnChangePlugin
          onChange={(editorState) => {
            const json = JSON.stringify(editorState);
            onChange?.(json);
          }}
        />
      </div>
    </LexicalComposer>
  );
}