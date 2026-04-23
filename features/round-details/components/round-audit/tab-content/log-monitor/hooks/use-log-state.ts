"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactionLogs } from "@/hooks/use-transactionlogs";
import { getDeepKeys } from "@/features/round-details/components/round-audit/tab-content/log-monitor/utils/log-utils";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { getServiceName } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/utils";

const DEFAULT_COLUMNS_BY_TAB: Record<string, string[]> = {
  platformLogs: [
    "raw.app.responseLog.log",
    "raw.app.serviceMethod",
    "raw.app.requestLog.log",
    "raw.app.url",
  ],
  lcTransactionLogs: [
    "message",
    "raw.contextMap",
  ],
  default: ["message"],
};

export function useLogState(roundId: string, timeStamp: any) {
  const { roundDetails } = useRoundDetails();
  const { data, isLoading } = useTransactionLogs({ roundId, timeStamp, game_id: roundDetails?.tptInfo?.at(0)?.game_id as string, user_id: roundDetails?.tptInfo?.at(0)?.user_id as string, game_type: roundDetails?.tptInfo?.at(0)?.game_mode as string });

  const [activeTab, setActiveTab] = useState<string | null>("");
  const [query, setQuery] = useState("");

  const [tabColumnState, setTabColumnState] = useState<
    Record<string, string[]>
  >({});

  /**
   * Tabs
   */
  const availableTabs = useMemo(() => {
    if (!data) return [];
    return Object.keys(data).filter((k) => Array.isArray(data[k]));
  }, [data]);

  /**
   * Auto-select first tab
   */
  useEffect(() => {
    if (availableTabs.length && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  /**
   * Extract logs + sidebar keys
   */
  const { logs, sidebarKeys } = useMemo(() => {
    if (!data || !activeTab) return { logs: [], sidebarKeys: [] };

    const tabLogs = data[activeTab] || [];
    const keySet = new Set<string>();

    tabLogs.forEach((log: any) => {
      if (log.message) keySet.add("message");

      if (log.raw) {
        getDeepKeys(log.raw).forEach((k) => {
          if (!k.includes("@timestamp")) {
            keySet.add(`raw.${k}`);
          }
        });
      }

      if (log.app) {
        getDeepKeys(log.app).forEach((k) => {
          keySet.add(`app.${k}`);
        });
      }
    });

    return {
      logs: tabLogs,
      sidebarKeys: Array.from(keySet).sort(),
    };
  }, [data, activeTab]);

  /**
   * Resolve default columns (FIXED MATCHING LOGIC)
   */
  const computedDefaultColumns = useMemo(() => {
    if (!activeTab || !sidebarKeys.length) return [];

    const defaults =
      DEFAULT_COLUMNS_BY_TAB[activeTab] ||
      DEFAULT_COLUMNS_BY_TAB.default;

    return defaults.filter((c) =>
      sidebarKeys.some(
        (k) => k === c || k.startsWith(c + ".")
      )
    );
  }, [activeTab, sidebarKeys]);

  /**
   * Final visible columns (source of truth)
   */
  const visibleColumns = useMemo(() => {
    if (!activeTab) return [];

    const saved = tabColumnState[activeTab];

    if (saved?.length) return saved;

    if (computedDefaultColumns.length) return computedDefaultColumns;

    return ["message"];
  }, [activeTab, tabColumnState, computedDefaultColumns]);

  /**
   * Update visible columns (persist per tab)
   */
  const setVisibleColumns = (updater: any) => {
    const next =
      typeof updater === "function"
        ? updater(visibleColumns)
        : updater;

    if (activeTab) {
      setTabColumnState((prev) => ({
        ...prev,
        [activeTab]: next,
      }));
    }
  };

  /**
   * Filter logs
   */
  const filteredLogs = useMemo(() => {
    const q = query.toLowerCase();

    return (logs || [])
      .filter((h: any) => {
        if (!q.trim()) return true;

        const fullText = `${h?.message ?? ""} ${h?._index ?? ""}`.toLowerCase();

        try {
          const tokenRegex =
            /"([^"]+)"|\b(and|or)\b|([\(\)])|([^\s\(\)]+)/gi;

          const expression = q.replace(
            tokenRegex,
            (match, phrase, logical, paren, word) => {
              if (phrase) return `fullText.includes("${phrase}")`;
              if (logical === "and" || logical === "&&" || logical === "AND") return " && ";
              if (logical === "or" || logical === "||" || logical === "OR") return " || ";
              if (paren) return paren;
              if (word) return `fullText.includes("${word}")`;
              return match;
            }
          );

          const checkLogic = new Function(
            "fullText",
            `return ${expression};`
          );

          return checkLogic(fullText);
        } catch (e) {
          return fullText.includes(q.replace(/"/g, ""));
        }
      })
      .sort(
        (a: any, b: any) =>
          new Date(a?.raw?.["@timestamp"] || 0).getTime() -
          new Date(b?.raw?.["@timestamp"] || 0).getTime()
      );
  }, [logs, query]);

  /**
   * Reset columns
   */
  const resetToDefault = () => {
    if (!activeTab) return;

    setTabColumnState((prev) => {
      const updated = { ...prev };
      delete updated[activeTab]; // remove override
      return updated;
    });
  };

  return {
    data,
    isLoading,
    activeTab,
    setActiveTab,
    query,
    setQuery,
    visibleColumns,
    setVisibleColumns,
    availableTabs,
    sidebarKeys,
    filteredLogs,
    roundId,
    resetToDefault,
  };
}