import type {
  SerializedRootNode,
  SerializedTextNode,
  SerializedElementNode,
  SerializedLexicalNode
} from 'lexical';
import { TPTTableInfo } from '@/features/round-details/types/tpt-table-info';
import { BetTableInfo } from '@/features/round-details/types/bet-table-info';

export interface SerializedFieldNode extends SerializedLexicalNode {
  type: 'field';
  keyName: string;
  display: string;
}

export type SerializedAppNode =
  | SerializedRootNode<any>
  | SerializedElementNode<any>
  | SerializedTextNode
  | SerializedFieldNode;

export interface SerializedEditorState {
  root: SerializedRootNode<SerializedAppNode>;
}

export function fillAndTransformData(
  node: any,
  data: Record<string, any>,
  linkMeta: Record<string, any> = {}
): any {
  if (!node) return node;

  if (node.type === "field") {
    const value = data[node.keyName];
    const meta = linkMeta?.[node.keyName];

    if (value === undefined || value === null) return node;

    const isLexicalNode =
      value &&
      typeof value === "object" &&
      typeof value.type === "string";

    if (isLexicalNode) {
      return value;
    }

    const textValue = String(value);

    if (meta?.isLink === "1" && meta?.linkTemplate) {
      return buildLinkNode(meta.linkTemplate, data, textValue);
    }

    return {
      type: "text",
      version: 1,
      text: textValue,
      detail: 0,
      format: 0,
      mode: "normal",
      style: "",
    };
  }
  if (node.type === "text") {
    let updatedText = node.text;
    let hasChanged = false;

    Object.entries(data).forEach(([key, val]) => {
      const regex = new RegExp(`{+${key}}+`, "g");

      if (regex.test(updatedText)) {
        updatedText = updatedText.replace(
          regex,
          typeof val === "object" ? "" : String(val)
        );
        hasChanged = true;
      }
    });

    if (hasChanged) {
      return { ...node, text: updatedText };
    }

    return node;
  }

  if (node.children && Array.isArray(node.children)) {
    return {
      ...node,
      children: node.children.map((child: any) =>
        fillAndTransformData(child, data, linkMeta)
      ),
    };
  }

  return node;
}
function createCell(
  text: string,
  options?: {
    bold?: boolean;
    bgColor?: string | null;
    align?: "left" | "right" | "center";
  }
) {
  return {
    type: "tablecell",
    version: 1,
    headerState: 0,
    width: 0,
    backgroundColor: options?.bgColor ?? null,
    rowSpan: 1,
    colSpan: 1,
    verticalAlign: "bottom",
    children: [
      {
        type: "paragraph",
        version: 1,
        format:
          options?.align === "right"
            ? "right"
            : options?.align === "center"
            ? "center"
            : "",
        indent: 0,
        children: [
          {
            type: "text",
            text: String(text ?? ""),
            version: 1,
            ...(options?.bold ? { format: 1 } : {}),
          },
        ],
      },
    ],
  };
}

function createHeaderRow(headers: string[]) {
  return {
    type: "tablerow",
    version: 1,
    height: 21,
    children: headers.map((h) =>
      createCell(h, {
        bold: true,
        bgColor: "rgb(217, 217, 217)", // ✅ grey header
      })
    ),
  };
}

function createRow(cells: any[]) {
  return {
    type: "tablerow",
    version: 1,
    height: 21,
    children: cells,
  };
}

export function buildBetDetailsTable(data: BetTableInfo) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const headers = ["Bet", "Amount", "Payoff", "Currency", "Status"];

  return {
    type: "table",
    version: 1,
    children: [
      createHeaderRow(headers),

      ...data.map((row) =>
        createRow([
          createCell(row.displayDescription),
          createCell(`${row.amount}`, { align: "right" }),
          createCell(`${row.payoff}`, { align: "right" }),
          createCell(row.currency_code),
          createCell(formatStatus(row.status)),
        ])
      ),
    ],
  };
}
export function buildTransactionTable(data: TPTTableInfo) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const headers = [
    "Amount",
    "Action",
    "Status",
    "Transaction ID",
    "Game Mode",
    "Error",
    "Retry",
    "Date",
    "Payoff",
  ];

  return {
    type: "table",
    version: 1,
    children: [
      createHeaderRow(headers),

      ...data.map((tx) =>
        createRow([
          createCell(`${tx.amount} ${tx.currency_code}`, { align: "right" }),
          createCell(tx.action_type),
          createCell(formatStatus(tx.status_code)),
          createCell(tx.transaction_id),
          createCell(tx.game_mode),
          createCell(
            `${tx.error_code || "-"} - ${tx.error_description || "-"}`
          ),
          createCell(String(tx.retry_counter), { align: "right" }),
          createCell(formatDate(tx.trans_date)),
          createCell(Number(tx.payoff ?? 0).toFixed(2), { align: "right" }),
        ])
      ),
    ],
  };
}
function formatStatus(status: string) {
  const map: Record<string, string> = {
    P: "Pending",
    S: "Settled",
    C: "Cancelled",
    F: "Failed",
  };
  return map[status] || status;
}

function formatDate(date: string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
}
export function buildLinkNode(
  template: string,
  data: Record<string, any>,
  textLabel?: string
) {
  if (!template) return null;

  // Trim template first
  let resolvedUrl = template.trim();

  Object.entries(data || {}).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, "g");

    // Trim each value before replacement
    const safeValue =
      value !== null && value !== undefined ? String(value).trim() : "";

    resolvedUrl = resolvedUrl.replace(regex, safeValue);
  });

  // Final cleanup (important for leftover spaces like " / ")
  resolvedUrl = resolvedUrl.trim().replace(/\s+/g, "");

  const finalText = (textLabel || resolvedUrl).trim();

  return {
    type: "link",
    version: 1,
    url: resolvedUrl,
    children: [
      {
        type: "text",
        version: 1,
        text: finalText,
        detail: 0,
        format: 0,
        mode: "normal",
        style: "",
      },
    ],
    rel: "noopener noreferrer",
    target: "_blank",
  };
}