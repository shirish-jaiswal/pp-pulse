"use client";

import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  COMMAND_PRIORITY_EDITOR,
  $createParagraphNode,
  $createTextNode,
  $insertNodes,
  ElementNode,
} from "lexical";

import {
  $createTableNodeWithDimensions,
  $isTableCellNode,
} from "@lexical/table";

import { INSERT_LOGS_COMMAND } from "./log-command";
import { getValueByPath } from "./log-utils";
import { COLUMN_LABELS } from "./log-labels";

function getTimepoint(log: any) {
  return (
    log?.raw?.["@timestamp"] ||
    log?.timestamp ||
    log?.time ||
    "-"
  );
}

export default function LogPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_LOGS_COMMAND,
      (payload) => {
        const { logs, activeTab, columns } = payload;

        // ✅ FORCE FIRST COLUMN
        const finalColumns = [
          "timepoint",
          ...columns,
        ];

        editor.update(() => {
          // =====================
          // Heading (Bold)
          // =====================

          const heading = $createParagraphNode();
          const title = $createTextNode(
            `Logs (${activeTab})`
          );
          title.setFormat("bold");
          heading.append(title);

          $insertNodes([heading]);

          // =====================
          // Table
          // =====================

          const tableNode = $createTableNodeWithDimensions(
            logs.length + 1,
            finalColumns.length,
            true
          );

          const tableElement = tableNode as ElementNode;
          const rows = tableElement.getChildren() as ElementNode[];

          // =====================
          // HEADER ROW
          // =====================

          const headerRow = rows[0] as ElementNode;
          const headerCells = headerRow.getChildren();

          headerCells.forEach((cell, index: number) => {
            if ($isTableCellNode(cell)) {
              const label =
                COLUMN_LABELS[finalColumns[index]] ??
                finalColumns[index].toUpperCase();

              const p = $createParagraphNode();
              const t = $createTextNode(label);
              t.setFormat("bold");

              p.append(t);
              cell.append(p);
            }
          });

          // =====================
          // DATA ROWS
          // =====================

          logs.forEach((log: any, rowIndex: number) => {
            const row = rows[rowIndex + 1] as ElementNode;
            const cells = row.getChildren();

            cells.forEach((cell, colIndex: number) => {
              if ($isTableCellNode(cell)) {
                const key = finalColumns[colIndex];

                let value: any;

                if (key === "timepoint") {
                  value = getTimepoint(log);
                } else {
                  value = getValueByPath(log, key);
                }

                const p = $createParagraphNode();
                p.append(
                  $createTextNode(
                    value == null ? "-" : String(value)
                  )
                );

                cell.append(p);
              }
            });
          });

          // =====================
          // Insert table
          // =====================

          $insertNodes([tableNode]);
          $insertNodes([$createParagraphNode()]);
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}