import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import {
  $getNodeByKey,
  KEY_DELETE_COMMAND,
  KEY_BACKSPACE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { useEffect } from "react";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";

export function ImageComponent({
  src,
  alt,
  nodeKey,
}: {
  src: string;
  alt: string;
  nodeKey: string;
}) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  useEffect(() => {
    return editor.registerCommand(
      KEY_DELETE_COMMAND,
      () => {
        if (isSelected) {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node?.remove();
          });
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, isSelected, nodeKey]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      () => {
        if (isSelected) {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node?.remove();
          });
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, isSelected, nodeKey]);

  return (
    <div
      className={`my-4 flex justify-center ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        clearSelection();
        setSelected(true);
      }}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg border shadow-sm cursor-pointer"
      />
    </div>
  );
}