"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $insertNodes,
  COMMAND_PRIORITY_HIGH,
  PASTE_COMMAND,
  $createParagraphNode,
} from "lexical";
import { $createImageNode, ImageNode } from "./image-node";

export default function ImagesPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImageNode not registered");
    }

    const removePaste = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (!file) continue;

            const reader = new FileReader();

            reader.onload = () => {
              const src = reader.result as string;

              editor.update(() => {
                const imageNode = $createImageNode({
                  src,
                  altText: file.name || "Pasted Image",
                });

                const paragraph = $createParagraphNode();
                paragraph.append(imageNode);

                $insertNodes([paragraph]);
              });
            };

            reader.readAsDataURL(file);

            event.preventDefault();
            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      removePaste();
    };
  }, [editor]);

  return null;
}