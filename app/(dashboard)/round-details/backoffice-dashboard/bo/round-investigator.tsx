"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { useDashboard } from "@/app/(dashboard)/round-details/backoffice-dashboard/context/dashboard-context"
import { RoundDetailsForm } from "@/app/(dashboard)/round-details/round/round-details-form"
import { PlayerBetTxnInfoProps } from "@/types/round-details-input"

export function RoundInvestigator() {

  const { setQueryParams, setActiveTab, setKibanaFunction } = useDashboard()

  const handleSubmit = (data: PlayerBetTxnInfoProps, kibanaFunction: string) => {
    setQueryParams(data)
    setActiveTab("rounds")
    setKibanaFunction(kibanaFunction)
  }

  return (
    <Card className="shadow-sm border-slate-200 p-0">
      <CardContent className="p-2">
        <div className="flex items-center gap-2 mb-1.5 text-slate-500">
          <Activity className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">
            Round Investigator
          </span>
        </div>
        <RoundDetailsForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  )
}