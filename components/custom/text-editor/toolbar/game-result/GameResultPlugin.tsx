"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { 
  $getSelection, 
  $isRangeSelection, 
  $getRoot,
  $insertNodes,
  $createParagraphNode,
  COMMAND_PRIORITY_EDITOR, 
  createCommand, 
  LexicalCommand 
} from "lexical";
import { $createGameResultNode, GameResultNode } from "./GameResultNode";

export const INSERT_GAME_RESULT_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_GAME_RESULT_COMMAND"
);

export default function GameResultPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([GameResultNode])) {
      throw new Error("GameResultPlugin: GameResultNode is not registered.");
    }

    return editor.registerCommand<string>(
      INSERT_GAME_RESULT_COMMAND,
      (configJson) => {
        editor.focus();

        editor.update(() => {
          const selection = $getSelection();
          const gameResultNode = $createGameResultNode(configJson);

          if ($isRangeSelection(selection)) {
            $insertNodes([gameResultNode]);
          } else {
            const root = $getRoot();
            root.append(gameResultNode);
            
            const emptyParagraph = $createParagraphNode();
            root.append(emptyParagraph);
          }
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}