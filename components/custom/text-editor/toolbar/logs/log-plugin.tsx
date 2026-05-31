"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_EDITOR,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  ElementNode,
  LexicalNode,
} from "lexical";

import { $createTableNodeWithDimensions, $isTableCellNode } from "@lexical/table";
import { INSERT_LOGS_COMMAND } from "./log-command";
import { getValueByPath } from "./log-utils";
import { COLUMN_LABELS } from "./log-labels";

export type GroupedRoundLogs = {
  roundId: string;
  logs: any[];
};

function getTimepoint(log: any) {
  return new Date(log?.timepoint || log?.timestamp || log?.time || Date.now()).toUTCString();
}

function formatCellValue(value: any): string {
  if (value == null) return "-";

  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  }

  return String(value);
}

export default function LogPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_LOGS_COMMAND,
      (payload) => {
        const { groupedLogs, activeTab, columns } = payload as any;
        const finalColumns = [
          "timepoint",
          ...columns.filter((c: string) => c !== "timepoint"),
        ];

        editor.update(() => {
          // Fall back to runtime context selection only if custom snapshot failed
          const selection = $getSelection();
          const hasValidSelection = $isRangeSelection(selection);

          const allNodesToInsert: LexicalNode[] = [];

          groupedLogs.forEach((group: GroupedRoundLogs) => {
            const { roundId, logs } = group;

            // =========================================================
            // ROUND HEADER
            // =========================================================
            const heading = $createParagraphNode();
            const title = $createTextNode(
              `Round ID: ${roundId} | Logs (${activeTab})`
            );
            title.setFormat("bold");
            heading.append(title);
            allNodesToInsert.push(heading);

            // =========================================================
            // TABLE CREATION
            // =========================================================
            const tableNode = $createTableNodeWithDimensions(
              logs.length + 1,
              finalColumns.length,
              true
            );

            const tableElement = tableNode as ElementNode;
            const rows = tableElement.getChildren() as ElementNode[];

            // =========================================================
            // HEADER ROW
            // =========================================================
            const headerRow = rows[0] as ElementNode;
            const headerCells = headerRow.getChildren();

            headerCells.forEach((cell, index: number) => {
              if ($isTableCellNode(cell)) {
                const key = finalColumns[index];
                const label = COLUMN_LABELS[key] ?? key.toUpperCase();
                const p = $createParagraphNode();
                const t = $createTextNode(label);
                t.setFormat("bold");
                p.append(t);
                cell.append(p);
              }
            });

            // =========================================================
            // DATA ROWS
            // =========================================================
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
                  const textValue = formatCellValue(value);
                  p.append($createTextNode(textValue));
                  cell.append(p);
                }
              });
            });

            allNodesToInsert.push(tableNode);

            // Add a spacer paragraph right below each block table
            allNodesToInsert.push($createParagraphNode());
          });

          // =========================================================
          // UNIFIED ATOMIC PLACEMENT INSERTER
          // =========================================================
          if (allNodesToInsert.length > 0) {
            if (hasValidSelection) {
              selection.insertNodes(allNodesToInsert);

              const lastNode = allNodesToInsert[allNodesToInsert.length - 1];

              if (lastNode instanceof ElementNode) {
                lastNode.selectEnd();
              }
            } else {
              const root = $getRoot();

              allNodesToInsert.forEach((node) => {
                root.append(node);
              });
            }
          }
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}