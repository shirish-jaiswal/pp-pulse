"use client"

import { DashboardProvider } from "@/app/(dashboard)/round-details/backoffice-dashboard/context/dashboard-context"
import { RoundInvestigator } from "@/app/(dashboard)/round-details/backoffice-dashboard/bo/round-investigator"
import { LogExplorer } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/content/log-explorer"
import { DashboardTabs } from "@/app/(dashboard)/round-details/backoffice-dashboard/shared/dashboard-tabs"

export default function UnifiedBackOfficeDashboard() {

  return (
    <DashboardProvider>
      <div className="flex flex-col h-screen bg-slate-50 overflow-y-auto">
        <main className="flex flex-col p-1 gap-2 mx-auto w-full">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-3">
              <RoundInvestigator />
            </div>
            <div className="col-span-9">
              <LogExplorer />
            </div>
          </div>
          <DashboardTabs />
        </main>
      </div>
    </DashboardProvider>
  )
}