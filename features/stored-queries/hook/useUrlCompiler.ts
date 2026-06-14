import { useState } from "react";
import { toast } from "sonner";
import { STORED_QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/stored-queries/get-all";
import { DateRangeValue } from "@/features/log-exp/date-time-range-picker/types";
import { generateKibanaUrl, formatKqlValue } from "@/utils/kibana-link-generator";

export function useUrlCompiler() {
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [currentTemplateForUrl, setCurrentTemplateForUrl] = useState<any | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeValue | undefined>(undefined);

  const extractPlaceholders = (tpl: any) => {
    setCurrentTemplateForUrl(tpl);
    setGeneratedUrl("");
    setSelectedDateRange(undefined);

    const baseQueryStr = tpl.query_string || tpl.raw_query_string || "";
    const regex = /\{([^}]+)\}/g;
    const found: string[] = [];
    let match;

    while ((match = regex.exec(baseQueryStr)) !== null) {
      if (!found.includes(match[1])) found.push(match[1]);
    }

    try {
      const parsedFilters = tpl.filters ? JSON.parse(tpl.filters) : [];
      parsedFilters.forEach((rule: any) => {
        regex.lastIndex = 0;
        while ((match = regex.exec(rule.value || "")) !== null) {
          if (!found.includes(match[1])) found.push(match[1]);
        }
      });
    } catch {}

    setPlaceholders(found);
    const initialInputs: Record<string, string> = {};
    found.forEach((key) => (initialInputs[key] = ""));
    setPlaceholderValues(initialInputs);
  };

  const compileUrl = (fallbackQueryString: string, indexPattern: string, defaultColumns: string) => {
    if (!currentTemplateForUrl) return;

    // Pre-format inputs for KQL (e.g., arrays into OR statements)
    const formattedReplacements: Record<string, string> = {};
    placeholders.forEach((key) => {
      formattedReplacements[key] = formatKqlValue(placeholderValues[key] || "");
    });

    const timeFrom = selectedDateRange?.from ? `'${selectedDateRange.from.toISOString()}'` : "now-24h%2Fh";
    const timeTo = selectedDateRange?.to ? `'${selectedDateRange.to.toISOString()}'` : "now";
    const sortDir = currentTemplateForUrl.title?.toLowerCase().includes("game") ? "asc" : "desc";

    const targetUrl = generateKibanaUrl({
      template: { ...currentTemplateForUrl, index: indexPattern || currentTemplateForUrl.index },
      replacements: formattedReplacements,
      timeFrom,
      timeTo,
      sortDirection: sortDir,
      fallbackQueryString,
      fallbackColumns: defaultColumns
    });

    setGeneratedUrl(targetUrl);
    toast.success("Compiled successfully!");
  };

  const copyUrl = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    toast.success("Copied!");
  };

  return {
    placeholders,
    placeholderValues,
    setPlaceholderValues,
    generatedUrl,
    selectedDateRange,
    setSelectedDateRange,
    extractPlaceholders,
    compileUrl,
    copyUrl,
  };
}