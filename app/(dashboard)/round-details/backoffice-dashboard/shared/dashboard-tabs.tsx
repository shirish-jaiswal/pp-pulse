"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"

import { Database, Search, Loader2, RefreshCw, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/utils/cn"

import { useDashboard } from "@/app/(dashboard)/round-details/backoffice-dashboard/context/dashboard-context"
import { useLogData } from "@/hooks/use-log-data"

import { ArrowDownAz, ArrowUpAz } from "lucide-react"
import { PlayerBetTxnInfoProps } from "@/types/round-details-input"
import { LogResultsDashboard } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/content/log-result-dashboard"
import { LogLoadingSkeleton } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/skeleton/log-skeleton"
import { RoundDataDisplay } from "@/app/(dashboard)/round-details/round/round-data-diaplay"
import { PlayerBetTxnResponse } from "@/types/round-details"
import { LogRequestParams } from "@/lib/server/kibana/search"
import { useEffect, useMemo } from "react"
import { KibanaEmptyState } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/skeleton/kibana-empty-state"

export function DashboardTabs() {

  const {
    activeTab,
    setActiveTab,
    logPayload,
    setLogPayload,
    sortOrder,
    setSortOrder,
    queryParams,
    kibanaFunction
  } = useDashboard()

  const {
    data: logData,
    isLoading: isLogsLoading,
    error: logError,
    refetch,
    isRefetching
  } = useLogData(logPayload as any)


  console.log("log Data ::", logData)
  const defaultParams = {
    gameParamId: "round_id",
    game_id: "",
    playerParamId: "user_id",
    user_id: ""
  } satisfies PlayerBetTxnInfoProps;

  const { data: boData, isLoading, error } ={data: { exist : true}, isLoading: false, error: { error: "" , mesage: "" }}

  const getLateBetPayload = (data: PlayerBetTxnResponse): LogRequestParams => {
    const txnDate = new Date(data.settlements.txnSettlementsList[0].txnDate);

    // Start of day
    const startDate = new Date(txnDate);
    startDate.setHours(0, 0, 0, 0);

    // End of day
    const endDate = new Date(txnDate);
    endDate.setHours(23, 59, 59, 999);

    const roundId = data.exists.roundId;
    const userId = data.exists.userId;
    const gameId = data.exists.gameId;

    return {
      index: "filebeat-*",
      query: `${roundId} OR (${userId} AND ${gameId})`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      sort: "asc",
      fields: []
    };
  };

  // const lateBetPayload = useMemo(() => {
  //   if (kibanaFunction?.trim() !== "LATE BET" || !boData) return null; return getLateBetPayload(boData);
  // }, [boData]);

  // useEffect(() => {
  //   if (lateBetPayload !== null) {
  //     console.log("LATE BET PAYLOAD :: ", lateBetPayload)

  //     setLogPayload(lateBetPayload);
  //   }
  // }, [lateBetPayload, setLogPayload]);
  console.log("logPayload :: ", logPayload)
  const handleSortToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc"
    setSortOrder(newOrder)
    if (logPayload) {
      setLogPayload({
        ...logPayload,
        sort: newOrder
      })
    }
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex-1 flex flex-col min-h-0"
    >
      <div className="flex items-center justify-between">
        <TabsList className="bg-slate-200/60">
          <TabsTrigger value="rounds" className="gap-2">
            <Database className="h-4 w-4" />
            Round Data
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Search className="h-4 w-4" />
            ELK Logs
          </TabsTrigger>
        </TabsList>

        {activeTab === "logs" && logPayload && !isLogsLoading && (
          <div className="flex items-center gap-2 mr-1">
            {logData && (
              <div className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold">{logData.total}</span> HITS
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSortToggle}
              className="gap-2 h-8 border-slate-300"
            >
              {sortOrder === "asc" ? (
                <ArrowUpAz className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownAz className="h-3.5 w-3.5" />
              )}
              <span className="text-xs uppercase font-bold">
                {sortOrder === "asc" ? "Asc" : "Desc"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLogsLoading || isRefetching}
              className="gap-2 h-8 shadow-sm"
            >
              <RefreshCw
                className={cn(
                  "h-3.5 w-3.5",
                  isRefetching && "animate-spin"
                )}
              />
              Refresh
            </Button>
          </div>
        )}
      </div>

      <TabsContent
        value="rounds"
        className="flex-1 min-h-0 mt-0 overflow-y-auto p-1"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            <p className="mt-4 text-sm text-muted-foreground">
              Syncing with BackOffice Ledger...
            </p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Fetch Failed</AlertTitle>
            <AlertDescription>
              {error.mesage || "Unexpected error"}
            </AlertDescription>
          </Alert>
        ) : !boData || !boData.exist ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Database className="h-8 w-8 text-slate-400 mb-4" />
            <h3 className="text-lg font-bold">
              No Round Selected
            </h3>
            <p className="text-sm text-slate-500">
              Enter a valid Round ID above
            </p>
          </div>
        ) : (
          <RoundDataDisplay data={boData} />
        )}
      </TabsContent>
      {/* LOG TAB */}
      <TabsContent
        value="logs"
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-auto">
          {isLogsLoading ? (
            <LogLoadingSkeleton />
          ) : (
            <>
              {!logPayload && (
               <KibanaEmptyState />
              )}
              {logError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Query Failed</AlertTitle>
                  <AlertDescription className="font-mono text-xs mt-2">
                    {JSON.stringify(logError.message)}
                  </AlertDescription>
                </Alert>
              )}

              {logData && !isRefetching && (
                <LogResultsDashboard data={logData} />
              )}
            </>
          )}

          {isRefetching && !isLogsLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <LogLoadingSkeleton />
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}