"use client";

import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/custom/text-editor/rich-text-editor";

export function EditorBlock({
  content,
  setContent,
}: {
  content: string;
  setContent: (val: string) => void;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-240px)]">
      <Label className="mb-2">Content</Label>
      <div className="flex-1 border rounded-md overflow-auto bg-background">
        <RichTextEditor onChange={setContent} initialValue={content} />
      </div>
    </div>
  );
}