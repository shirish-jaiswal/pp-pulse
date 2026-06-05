import { SelectedRoundDetailsMap } from '@/features/round-details/context/round-details-context';
import { TPTTableInfo } from '@/features/round-details/types/tpt-table-info';
import { BetTableInfo } from '@/features/round-details/types/bet-table-info';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Enhanced transformation handler tracking field render iterations to strip matching repetitions.
 *
 * @param node The abstract node configuration object.
 * @param data The payload dataset variables.
 * @param linkMeta Parameter template URLs mappings.
 * @param seenFields Unique string tracker tracking already dispatched variables.
 * @param fieldsToDeduplicate Config array mapping keys that should display only once (e.g., ['casino_id', 'player_id', 'casino_name']).
 */
export function fillAndTransformData(
  node: any,
  data: Record<string, any>,
  linkMeta: Record<string, any> = {},
  seenFields: Set<string> = new Set(),
  fieldsToDeduplicate: string[] = ["casino_id", "player_id", "casino_name", "user_id"]
): any {
  if (!node) return node;

  if (node.type === "field") {
    const value = data[node.keyName];
    const meta = linkMeta?.[node.keyName];

    if (value === undefined || value === null) return node;

    // Check if this field name is flagged for single-rendering and has already been displayed
    if (fieldsToDeduplicate.includes(node.keyName)) {
      const trackingKey = `${node.keyName}_${String(value).trim()}`;
      if (seenFields.has(trackingKey)) {
        // Return an empty text node to hide the repetition while maintaining structural positioning
        return {
          type: "text",
          version: 1,
          text: "",
          detail: 0,
          format: 0,
          mode: "normal",
          style: "",
        };
      }
      // Register this field value so subsequent iterations are hidden
      seenFields.add(trackingKey);
    }

    const isLexicalStructure =
      value &&
      typeof value === "object" &&
      (typeof value.type === "string" || Array.isArray(value));

    if (isLexicalStructure) {
      return value;
    }

    const textValue = String(value).trim();

    if (meta?.isLink === "1" && meta?.linkTemplate) {
      return buildLinkNode(meta.linkTemplate, data, textValue);
    }

    return {
      type: "text",
      version: 1,
      text: escapeHtml(textValue),
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
        let replacementText = "";

        // Handle deduplication check inside arbitrary string-interpolated token replacements
        if (fieldsToDeduplicate.includes(key)) {
          const trackingKey = `${key}_${String(val).trim()}`;
          if (seenFields.has(trackingKey)) {
            replacementText = ""; // Deduplicate inline
          } else {
            seenFields.add(trackingKey);
            replacementText = typeof val === "object" ? "" : escapeHtml(String(val).trim());
          }
        } else {
          replacementText = typeof val === "object" ? "" : escapeHtml(String(val).trim());
        }

        updatedText = updatedText.replace(regex, replacementText);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      return { ...node, text: updatedText };
    }

    return node;
  }

  if (node.children && Array.isArray(node.children)) {
    const nextChildren: any[] = [];

    node.children.forEach((child: any) => {
      // Forward our seenFields context to keep tracking consistent down the recursive tree
      const transformedChild = fillAndTransformData(child, data, linkMeta, seenFields, fieldsToDeduplicate);
      if (Array.isArray(transformedChild)) {
        nextChildren.push(...transformedChild);
      } else {
        nextChildren.push(transformedChild);
      }
    });

    return {
      ...node,
      children: nextChildren,
    };
  }

  return node;
}

// Generates an interactive Editor node equipped with a hidden copier blueprint map
function createTableCellNode(
  text: string,
  options?: {
    isHeader?: boolean;
    align?: "left" | "right" | "center";
  }
) {
  const isHeader = options?.isHeader ?? false;
  const alignment = options?.align ?? "left";
  const cleanContent = escapeHtml(String(text ?? "")).trim();

  // Blueprint attributes loaded exclusively when hitting 'Copy HTML' toolbar triggers
  const htmlExportStyles = isHeader
    ? `border: 2px solid #555; background: #f3f4f6; padding: 10px 14px; text-align: ${alignment}; font-weight: 600; white-space: nowrap; font-family: Arial, sans-serif; font-size: 13px;`
    : `border: 1px solid #777; padding: 10px 14px; text-align: ${alignment}; vertical-align: top; line-height: 1.5; white-space: pre-wrap; max-width: 500px; word-break: break-word; font-family: Arial, sans-serif; font-size: 13px;`;

  return {
    type: "tablecell",
    version: 1,
    headerState: isHeader ? 1 : 0,
    width: 0,
    backgroundColor: isHeader ? "rgb(243, 244, 246)" : null,
    rowSpan: 1,
    colSpan: 1,
    verticalAlign: "top",
    style: isHeader
      ? "border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: bold; padding: 8px;"
      : "border: 1px solid #cbd5e1; padding: 8px;",
    exportDOM: () => {
      const element = document.createElement(isHeader ? "th" : "td");
      element.setAttribute("style", htmlExportStyles);
      element.innerHTML = cleanContent;
      return { element };
    },
    children: [
      {
        type: "paragraph",
        version: 1,
        format: alignment === "left" ? "" : alignment,
        indent: 0,
        children: [
          {
            type: "text",
            text: cleanContent,
            version: 1,
            ...(isHeader ? { format: 1 } : {}),
          },
        ],
      },
    ],
  };
}

function createTableRowNode(cells: any[]) {
  return {
    type: "tablerow",
    version: 1,
    height: 0,
    children: cells,
  };
}

function createTableTitleNode(text: string) {
  const titleText = `${text.trim()}`;
  return {
    type: "paragraph",
    version: 1,
    format: "",
    indent: 0,
    exportDOM: () => {
      const element = document.createElement("p");
      element.setAttribute("style", "font-family: Arial, sans-serif; font-size: 14px; color: #0f172a; font-weight: bold; margin-top: 16px; margin-bottom: 8px;");
      element.innerHTML = titleText;
      return { element };
    },
    children: [
      {
        type: "text",
        text: titleText,
        version: 1,
        format: 1,
        style: "font-family: Arial, sans-serif; font-size: 14px; color: #0f172a; font-weight: bold;",
      }
    ]
  };
}

/* ==========================================
   SOLO NODE BUILDERS (RETURNS VALID NODES)
   ========================================== */

export function buildBetDetailsTable(data: BetTableInfo) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const headers = ["Bet", "Amount", "Payoff", "Currency", "Status"];

  return {
    type: "table",
    version: 1,
    style: "border-collapse: collapse; border: 1px solid #cbd5e1; width: 100%; margin: 8px 0;",
    exportDOM: () => {
      const element = document.createElement("table");
      element.setAttribute("style", "border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 13px;");
      return { element };
    },
    children: [
      createTableRowNode(headers.map(h => createTableCellNode(h, { isHeader: true }))),
      ...data.map((row) =>
        createTableRowNode([
          createTableCellNode(row.displayDescription),
          createTableCellNode(`${row.amount}`, { align: "right" }),
          createTableCellNode(`${row.payoff}`, { align: "right" }),
          createTableCellNode(row.currency_code),
          createTableCellNode(formatStatus(row.status)),
        ])
      ),
    ],
  };
}

export function buildTransactionTable(data: TPTTableInfo) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const headers = ["Amount", "Action", "Status", "Transaction ID", "Game Mode", "Error", "Retry", "Date", "Payoff"];

  return {
    type: "table",
    version: 1,
    style: "border-collapse: collapse; border: 1px solid #cbd5e1; width: 100%; margin: 8px 0;",
    exportDOM: () => {
      const element = document.createElement("table");
      element.setAttribute("style", "border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 13px;");
      return { element };
    },
    children: [
      createTableRowNode(headers.map(h => createTableCellNode(h, { isHeader: true }))),
      ...data.map((tx) =>
        createTableRowNode([
          createTableCellNode(`${tx.amount} ${tx.currency_code}`, { align: "right" }),
          createTableCellNode(tx.action_type),
          createTableCellNode(formatStatus(tx.status_code)),
          createTableCellNode(tx.transaction_id),
          createTableCellNode(tx.game_mode),
          createTableCellNode(`${tx.error_code || "-"} - ${tx.error_description || "-"}`),
          createTableCellNode(String(tx.retry_counter), { align: "right" }),
          createTableCellNode(formatDate(tx.trans_date)),
          createTableCellNode(Number(tx.payoff ?? 0).toFixed(2), { align: "right" }),
        ])
      ),
    ],
  };
}

/* ==========================================
   BULK NODE BUILDERS (RETURNS VALID NODES)
   ========================================== */

export function buildBulkBetDetailsTables(selectedMap: SelectedRoundDetailsMap) {
  const nodesList: any[] = [];

  Object.entries(selectedMap).forEach(([id, roundPayload]) => {
    if (!roundPayload?.betInfo) return;
    const tableStructure = buildBetDetailsTable(roundPayload.betInfo as BetTableInfo);
    if (tableStructure) {
      nodesList.push(createTableTitleNode(`Round ID Details: ${id}`));
      nodesList.push(tableStructure);
    }
  });

  return nodesList.length > 0 ? nodesList : null;
}

export function buildBulkTransactionTables(selectedMap: SelectedRoundDetailsMap) {
  const nodesList: any[] = [];

  Object.entries(selectedMap).forEach(([id, roundPayload]) => {
    if (!roundPayload?.tptInfo) return;
    const tableStructure = buildTransactionTable(roundPayload.tptInfo as TPTTableInfo);
    if (tableStructure) {
      nodesList.push(createTableTitleNode(`Round Transactions: ${id}`));
      nodesList.push(tableStructure);
    }
  });

  return nodesList.length > 0 ? nodesList : null;
}

function formatStatus(status: string) {
  const map: Record<string, string> = { P: "Pending", S: "Settled", C: "Cancelled", F: "Failed" };
  return map[status] || status;
}

function formatDate(date: string) {
  if (!date) return "";
  try { return new Date(date).toUTCString(); } catch { return date; }
}

export function buildLinkNode(template: string, data: Record<string, any>, textLabel?: string) {
  if (!template) return null;
  let resolvedUrl = template.trim();

  Object.entries(data || {}).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, "g");
    resolvedUrl = resolvedUrl.replace(regex, value !== null && value !== undefined ? String(value).trim() : "");
  });

  resolvedUrl = resolvedUrl.trim().replace(/\s+/g, "");
  return {
    type: "link",
    version: 1,
    url: resolvedUrl,
    children: [{ type: "text", version: 1, text: escapeHtml(textLabel || resolvedUrl).trim(), detail: 0, format: 0, mode: "normal", style: "" }],
    rel: "noopener noreferrer",
    target: "_blank",
  };
}