"use client";

import { useState } from "react";

import { useAuditLogs } from "@/features/audit-logs/hooks/useAuditLogs";
import { useAuditFilters } from "@/features/audit-logs/hooks/useAuditFilters";
import { usePivotData } from "@/features/audit-logs/hooks/usePivotData";

import Header from "@/features/audit-logs/components/Header";
import SearchBar from "@/features/audit-logs/components/SearchBar";
import FilterPopover from "@/features/audit-logs/components/FilterPopover";
import LogsTable from "@/features/audit-logs/components/LogsTable";
import Pagination from "@/features/audit-logs/components/Pagination";
import ExportButton from "@/features/audit-logs/components/ExportButton";

import KPICards from "@/features/audit-logs/components/analytics/KPICards";
import ActionChart from "@/features/audit-logs/components/analytics/ActionChart";
import UserChart from "@/features/audit-logs/components/analytics/UserChart";
import TrendChart from "@/features/audit-logs/components/analytics/TrendChart";

export function AuditLogsWrapper() {
  const [activeTab, setActiveTab] = useState("logs");
  const [chartTab, setChartTab] = useState("actions");

  // ✅ CORRECT HOOK
  const { logs, refreshLogs, loading } = useAuditLogs();

  const {
    search,
    setSearch,
    paginated,
    page,
    setPage,
    totalPages,
    filtered,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
  } = useAuditFilters(logs);

  const { byAction, byUser, byDate } = usePivotData(filtered);

  return (
    <div className="px-6 py-4 bg-gray-50 min-h-screen">

      {/* ✅ MAIN TABS */}
      <div className="flex gap-4 mb-4 border-b">
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 ${
            activeTab === "logs"
              ? "border-b-2 border-blue-600 font-medium"
              : "text-gray-500"
          }`}
        >
          Logs
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 ${
            activeTab === "analytics"
              ? "border-b-2 border-blue-600 font-medium"
              : "text-gray-500"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* ✅ LOGS TAB */}
      {activeTab === "logs" && (
        <>
          <Header />

          <SearchBar search={search} setSearch={setSearch} />

          <div className="flex justify-between items-center mb-4">

            <FilterPopover
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />

            <div className="flex gap-2 items-center">

              {/* ✅ MANUAL REFRESH ONLY */}
              <button
                onClick={refreshLogs}
                disabled={loading}
                className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "🔄 Refresh"}
              </button>

              {loading && (
                <span className="text-xs text-gray-500">
                  Fetching latest logs...
                </span>
              )}

              <ExportButton logs={filtered} />

            </div>
          </div>

          <LogsTable logs={paginated} />

          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </>
      )}

      {/* ✅ ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div>

          <div className="mb-4">
            <KPICards logs={filtered} />
          </div>

          {/* INSIGHTS */}
          <div className="grid grid-cols-3 gap-3 mb-4">

            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Top Action</p>
              <p className="text-lg font-semibold">
                {byAction?.[0]?.action || "-"}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Top User</p>
              <p className="text-lg font-semibold">
                {byUser?.[0]?.user || "-"}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Peak Time</p>
              <p className="text-lg font-semibold">
                {byDate?.[0]?.date || "-"}
              </p>
            </div>

          </div>

          {/* ✅ CHART TABS */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setChartTab("actions")}
              className={`px-4 py-2 rounded-md ${
                chartTab === "actions"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Actions
            </button>

            <button
              onClick={() => setChartTab("users")}
              className={`px-4 py-2 rounded-md ${
                chartTab === "users"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Users
            </button>

            <button
              onClick={() => setChartTab("trend")}
              className={`px-4 py-2 rounded-md ${
                chartTab === "trend"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Trend
            </button>
          </div>

          {/* CHART PANEL */}
          <div className="bg-white border rounded-xl p-4 shadow-sm">

            {chartTab === "actions" && (
              <ActionChart data={byAction.slice(0, 10)} />
            )}

            {chartTab === "users" && (
              <UserChart data={byUser.slice(0, 10)} />
            )}

            {chartTab === "trend" && (
              <TrendChart data={byDate} />
            )}

          </div>

        </div>
      )}

    </div>
  );
}