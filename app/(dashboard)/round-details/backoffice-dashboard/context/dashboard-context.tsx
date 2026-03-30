"use client"

import React, { createContext, useContext, useState } from "react"
import { LogRequestParams, SortType } from "@/lib/server/kibana/search"
import { PlayerBetTxnInfoProps } from "@/types/round-details-input"

type DashboardContextType = {
  activeTab: string
  setActiveTab: (v: string) => void

  logPayload: LogRequestParams | null
  setLogPayload: (v: LogRequestParams | null) => void

  sortOrder: SortType
  setSortOrder: (v: SortType) => void

  queryParams: PlayerBetTxnInfoProps | null
  setQueryParams: (v: PlayerBetTxnInfoProps | null) => void

  kibanaFunction : any,
  setKibanaFunction: (v: string) => void
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {

  const [activeTab, setActiveTab] = useState("rounds")
  const [logPayload, setLogPayload] = useState<LogRequestParams | null>(null)
  const [sortOrder, setSortOrder] = useState<SortType>("asc")
  const [queryParams, setQueryParams] = useState<PlayerBetTxnInfoProps | null>(null)
  const [kibanaFunction, setKibanaFunction] = useState<string>("");

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        logPayload,
        setLogPayload,
        sortOrder,
        setSortOrder,
        queryParams,
        setQueryParams,
        kibanaFunction,
        setKibanaFunction
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider")
  return ctx
}