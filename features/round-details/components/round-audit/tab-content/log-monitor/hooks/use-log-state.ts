"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactionLogs } from "@/hooks/use-transactionlogs";
import { getDeepKeys } from "@/features/round-details/components/round-audit/tab-content/log-monitor/utils/log-utils";

const DEFAULT_COLUMNS_BY_TAB: Record<string, string[]> = {
  platformLogs: [
    "app.responseLog.log",
    "app.serviceMethod",
    "app.requestLog.log",
    "app.url",
  ],
  default: ["message"],
};

export function useLogState(roundId: string, timeStamp: any) {
  const { data, isLoading } = useTransactionLogs({ roundId, timeStamp });

  const [activeTab, setActiveTab] = useState<string | null>("");
  const [query, setQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  /**
   * Track per-tab user overrides (optional but important)
   */
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
   * Extract logs + keys
   */
  const { logs, sidebarKeys } = useMemo(() => {
    if (!data || !activeTab) return { logs: [], sidebarKeys: [] };

    const tabLogs = data[activeTab] || [];
    const keySet = new Set<string>();

    tabLogs.forEach((log: any) => {
      if (log.message) keySet.add("message");

      if (log.raw) {
        getDeepKeys(log.raw).forEach((k) => {
          if (!k.includes("@timestamp")) keySet.add(k);
        });
      }
    });

    return {
      logs: tabLogs,
      sidebarKeys: Array.from(keySet).sort(),
    };
  }, [data, activeTab]);

  /**
   * 🔥 KEY FIX: apply defaults whenever tab changes
   */
  useEffect(() => {
    if (!activeTab || !sidebarKeys.length) return;

    const saved = tabColumnState[activeTab];

    // If user previously modified this tab → restore it
    if (saved?.length) {
      setVisibleColumns(saved);
      return;
    }

    // Otherwise apply defaults for this tab
    const defaults =
      DEFAULT_COLUMNS_BY_TAB[activeTab] ||
      DEFAULT_COLUMNS_BY_TAB.default;

    const validDefaults = defaults.filter((c) =>
      sidebarKeys.includes(c)
    );

    setVisibleColumns(validDefaults);
  }, [activeTab, sidebarKeys]);

  /**
   * Persist user changes per tab
   */
  const updateVisibleColumns = (updater: any) => {
    setVisibleColumns((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : updater;

      if (activeTab) {
        setTabColumnState((s) => ({
          ...s,
          [activeTab]: next,
        }));
      }

      return next;
    });
  };

  /**
   * Logs filter
   */
  const filteredLogs = useMemo(() => {
    const q = query.toLowerCase();

    return (logs || [])
      .filter((l: any) =>
        !q ? true : JSON.stringify(l).toLowerCase().includes(q)
      )
      .sort(
        (a: any, b: any) =>
          new Date(a.raw?.["@timestamp"] || 0).getTime() -
          new Date(b.raw?.["@timestamp"] || 0).getTime()
      );
  }, [logs, query]);

  /**
   * Reset to default for current tab
   */
  const resetToDefault = () => {
    if (!activeTab) return;

    const defaults =
      DEFAULT_COLUMNS_BY_TAB[activeTab] ||
      DEFAULT_COLUMNS_BY_TAB.default;

    const validDefaults = defaults.filter((k) =>
      sidebarKeys.includes(k)
    );

    setTabColumnState((s) => ({
      ...s,
      [activeTab]: validDefaults,
    }));

    setVisibleColumns(validDefaults);
  };

  return {
    data,
    isLoading,
    activeTab,
    setActiveTab,
    query,
    setQuery,
    visibleColumns,
    setVisibleColumns: updateVisibleColumns,
    availableTabs,
    sidebarKeys,
    filteredLogs,
    roundId,
    resetToDefault,
  };
}