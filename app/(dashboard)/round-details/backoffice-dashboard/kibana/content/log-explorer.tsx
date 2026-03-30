"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Terminal } from "lucide-react"
import { useDashboard } from "@/app/(dashboard)/round-details/backoffice-dashboard/context/dashboard-context"
import { KibanaSearchForm } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/kibana-search-form"
import { LogRequestParams } from "@/lib/server/kibana/search"

export function LogExplorer() {

  const { logPayload, setLogPayload, sortOrder, setActiveTab } = useDashboard()
  
  const handleSearch = (data: any) => {
    setLogPayload({
      ...data,
      sort: sortOrder
    })
    setActiveTab("logs")
  }

  return (
    <Card className="shadow-sm border-slate-200 p-0">
      <CardContent className="p-2">
        <div className="flex items-center gap-2 mb-1 text-slate-500">
          <Terminal className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">
            Log Explorer
          </span>
        </div>
        <KibanaSearchForm
          onSearch={handleSearch}
          initialValues={logPayload as LogRequestParams}
        />
      </CardContent>
    </Card>
  )
}