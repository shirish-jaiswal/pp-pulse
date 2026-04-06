import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, LexicalCommand, $insertNodes, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $createFieldNode, FieldNode } from "@/components/custom/text-editor/field-node";


export const INSERT_FIELD_COMMAND: LexicalCommand<{ key: string; value: string }> = 
  createCommand("INSERT_FIELD_COMMAND");

export default function FieldPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([FieldNode])) return;

    return editor.registerCommand(
      INSERT_FIELD_COMMAND,
      (payload) => {
        editor.update(() => {
          const fieldNode = $createFieldNode(payload.key, payload.value);
          $insertNodes([fieldNode]);
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}