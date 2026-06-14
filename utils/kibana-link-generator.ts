interface FilterRuleItem {
  id: string;
  field: string;
  type: "phrases" | "exists";
  negate: boolean;
  value: string;
}

export interface KibanaUrlGenerationParams {
  template: any; // The database template object
  replacements: Record<string, string>; // Key-value pairs for {token} replacement
  timeFrom: string;
  timeTo: string;
  sortDirection: "asc" | "desc";
  fallbackQueryString?: string;
  fallbackColumns?: string;
}

// Helper: Formats comma-separated strings into KQL OR syntax
export const formatKqlValue = (val: string): string => {
  const trimmed = val.trim();
  if (!trimmed) return "";
  if (trimmed.includes(",")) {
    const tokens = trimmed.split(",").map((t) => t.trim()).filter(Boolean);
    if (tokens.length === 1) return tokens[0];
    return `(${tokens.join(" OR ")})`;
  }
  return trimmed;
};

// Helper: Serializes JS objects into Kibana RISON format
const serializeToRison = (obj: any): string => {
  if (obj === null) return "!n";
  if (obj === true) return "!t";
  if (obj === false) return "!f";
  if (typeof obj === "number") return obj.toString();
  if (typeof obj === "string") {
    const isSimpleIdentifier = /^[A-Za-z0-9._-]+$/.test(obj);
    return isSimpleIdentifier ? obj : `'${obj.replace(/'/g, "''")}'`;
  }
  if (Array.isArray(obj)) return `!(${obj.map(serializeToRison).join(",")})`;
  if (typeof obj === "object") {
    return `(${Object.entries(obj).map(([key, value]) => `${key.startsWith("$") ? `'${key}'` : key}:${serializeToRison(value)}`).join(",")})`;
  }
  return "";
};

// Helper: Safely quotes index patterns if they start with numbers
const risonQuote = (val: string): string => {
  if (/^[a-zA-Z_][a-zA-Z0-9_\-]*$/.test(val)) return val;
  return `'${val.replace(/'/g, "''")}'`;
};

// --- MAIN GENERATOR FUNCTION ---
export function generateKibanaUrl({
  template,
  replacements,
  timeFrom,
  timeTo,
  sortDirection,
  fallbackQueryString = "",
  fallbackColumns = ""
}: KibanaUrlGenerationParams): string {
  if (!template) return "";

  const indexPatternId = template.index || template.index_pattern || "8ddfb450-4bb6-11e9-9f5b-7759dded6c19";
  const indexWrapper = risonQuote(indexPatternId);

  // 1. Process Query String
  let finalQuery = template.query_string || template.raw_query_string || fallbackQueryString;
  Object.entries(replacements).forEach(([key, value]) => {
    finalQuery = finalQuery.replaceAll(`{${key}}`, value);
  });

  // 2. Process Dynamic Filters
  let kibanaFiltersArray: any[] = [];
  try {
    const parsedRules: FilterRuleItem[] = template.filters ? JSON.parse(template.filters) : [];
    
    kibanaFiltersArray = parsedRules.map((rule) => {
      const cleanField = rule.field.trim();
      const isNegate = !!rule.negate;

      const baseMeta = { alias: null, disabled: false, index: indexPatternId, key: cleanField, negate: isNegate };

      if (rule.type === "exists") {
        return {
          $state: { store: "appState" },
          meta: { ...baseMeta, type: "exists", value: "exists" },
          query: { exists: { field: cleanField } }
        };
      } else {
        let finalRuleValue = rule.value || "";
        Object.entries(replacements).forEach(([key, value]) => {
          finalRuleValue = finalRuleValue.replaceAll(`{${key}}`, value);
        });

        return {
          $state: { store: "appState" },
          meta: { ...baseMeta, type: "phrase", value: finalRuleValue },
          query: { match_phrase: { [cleanField]: finalRuleValue } }
        };
      }
    });
  } catch (e) {
    console.error("Failed compiling template filters payload:", e);
  }

  const finalFiltersPayload = decodeURIComponent(serializeToRison(kibanaFiltersArray));

  // 3. Process Columns
  const targetCols = fallbackColumns || template.default_columns || template.columns;
  const columnsArray = targetCols ? targetCols.split(",").map((c: string) => c.trim()).filter(Boolean) : [];
  const formattedColumns = columnsArray.length > 0 
    ? decodeURIComponent(serializeToRison(columnsArray)) 
    : "!(message)";

  // 4. Encode Query String Spaces Safely
  const safeQueryText = finalQuery
    .replace(/'/g, "''")
    .replace(/ /g, "%20")
    .replace(/\(/g, "%20(")
    .replace(/\)/g, ")%20")
    .replaceAll("%20%20", "%20")
    .trim();

  // 5. Assemble Final URL
  const rawTargetUrl = `https://kibana.livetechlabs.net/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:60000),time:(from:${timeFrom},to:${timeTo}))&_a=(columns:${formattedColumns},filters:${finalFiltersPayload},hideChart:!t,index:${indexWrapper},interval:auto,query:(language:kuery,query:'${safeQueryText}'),sort:!(!('@timestamp',${sortDirection})))`;

  return decodeURIComponent(rawTargetUrl);
}