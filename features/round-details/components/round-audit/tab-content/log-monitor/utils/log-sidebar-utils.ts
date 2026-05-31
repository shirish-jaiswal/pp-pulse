/**
 * -------------------------------------------------------
 * LABEL MAP
 * -------------------------------------------------------
 */
const HEADER_MAP: Record<string, string> = {
  serviceMethod: "Method",
  url: "Endpoint",
  "requestLog.log": "Request",
  "responseLog.log": "Response",
};

/**
 * -------------------------------------------------------
 * NORMALIZE KEY
 * -------------------------------------------------------
 */
export const normalizeKey = (key: string): string =>
  key.replace(/^raw\./, "").replace(/^app\./, "").trim();

/**
 * -------------------------------------------------------
 * FORMAT LABEL
 * -------------------------------------------------------
 */
export const formatLabel = (key: string): string => {
  const cleaned = normalizeKey(key);

  return (
    HEADER_MAP[cleaned] ||
    cleaned
      .replace(/\./g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
};

/**
 * -------------------------------------------------------
 * HELPERS
 * -------------------------------------------------------
 */
export const getNestedValue = (obj: any, path: string): any =>
  path.split(".").reduce((acc: any, key) => acc?.[key], obj);

export const escapeHtml = (value: any): string =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * -------------------------------------------------------
 * ORDER COLUMNS (timestamp always first)
 * -------------------------------------------------------
 */
export const getOrderedColumns = (cols: string[], logs: any[]): string[] => {
  const timestampKey = "timestamp";

  const hasTimestamp = logs?.some(
    (l) => getNestedValue(l, timestampKey) != null
  );

  const withoutTs = cols.filter((c) => c !== timestampKey);

  return hasTimestamp ? [timestampKey, ...withoutTs] : cols;
};

/**
 * -------------------------------------------------------
 * BUILDERS FOR COPY TABLE
 * -------------------------------------------------------
 */
export const buildHtmlTable = (visibleColumns: string[], logs: any[]): string => {
  const orderedColumns = getOrderedColumns(visibleColumns, logs);

  const headers = orderedColumns
    .map(
      (col) =>
        `<th style="border-bottom:2px solid #e2e8f0;background:#f8fafc;color:#475569;padding:12px 16px;text-align:left;font-weight:600;white-space:nowrap;font-size:12px;">${escapeHtml(
          formatLabel(col)
        )}</th>`
    )
    .join("");

  const rows = logs
    .map((log) => {
      const cells = orderedColumns
        .map((col) => {
          const rawValue = getNestedValue(log, col);

          let value =
            rawValue == null
              ? "-"
              : typeof rawValue === "object"
              ? JSON.stringify(rawValue)
              : String(rawValue);

          const isTime = col === "timestamp";

          if (isTime && value !== "-") {
            value = new Date(value).toUTCString();
          }

          const isNumeric =
            /^[\s]*?-?[\d,.]+(?:\s?[A-Z]{3})?[\s]*?$/.test(value) &&
            !isTime;

          const align = isNumeric ? "text-align:right;" : "text-align:left;";

          return `<td style="border:1px solid #e2e8f0;padding:10px 14px;white-space:pre-wrap;max-width:500px;word-break:break-word;font-size:13px;color:#1e293b;${align}">${escapeHtml(
            value.trim()
          )}</td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <table style="border-collapse:collapse;width:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial;font-size:13px;">
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `.trim();
};

export const buildPlainText = (visibleColumns: string[], logs: any[]): string => {
  const orderedColumns = getOrderedColumns(visibleColumns, logs);

  return logs
    .map((log) =>
      orderedColumns
        .map((col) => {
          const value = getNestedValue(log, col);
          return `${formatLabel(col)}: ${
            value == null ? "-" : String(value)
          }`;
        })
        .join(" | ")
    )
    .join("\n");
};