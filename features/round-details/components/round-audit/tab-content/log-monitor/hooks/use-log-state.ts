"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactionLogs } from "@/hooks/use-transactionlogs";
import { getDeepKeys } from "@/features/round-details/components/round-audit/tab-content/log-monitor/utils/log-utils";

export function useLogState(roundId: string, timeStamp: any) {
  const { data, isLoading } = useTransactionLogs({ roundId, timeStamp });

  const [activeTab, setActiveTab] = useState<string | null>("");
  const [query, setQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  const availableTabs = useMemo(() => {
    if (!data) return [];
    return Object.keys(data).filter((k) => Array.isArray(data[k]));
  }, [data]);

  useEffect(() => {
    if (availableTabs.length && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  const { logs, sidebarKeys } = useMemo(() => {
    if (!data || !activeTab) return { logs: [], sidebarKeys: [] };

    const tabLogs = data[activeTab] || [];
    const keySet = new Set<string>();

    tabLogs.forEach((log: any) => {
      if (log.message) keySet.add("message");

      if (log.raw) {
        getDeepKeys(log.raw).forEach((k) => {
          if (!k.includes("@timestamp")) keySet.add(`raw.${k}`);
        });
      }
    });

    return {
      logs: tabLogs,
      sidebarKeys: Array.from(keySet).sort(),
    };
  }, [data, activeTab]);

  useEffect(() => {
    if (!sidebarKeys.length) return;

    let defaults: string[] = ["message"];

    if (activeTab === "platformLogs") {
      defaults = [
        "raw.app.requestLog.log",
        "raw.app.responseLog.log",
        "raw.app.serviceMethod",
        "raw.app.url",
      ];
    }

    setVisibleColumns(defaults.filter((c) => sidebarKeys.includes(c)));
  }, [activeTab, sidebarKeys]);

  const filteredLogs = useMemo(() => {
    const q = query.toLowerCase();

    return (logs || [])
      .filter((l: any) => !q || JSON.stringify(l).toLowerCase().includes(q))
      .sort(
        (a: any, b: any) =>
          new Date(a.raw?.["@timestamp"] || 0).getTime() -
          new Date(b.raw?.["@timestamp"] || 0).getTime()
      );
  }, [logs, query]);

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
  };
}
