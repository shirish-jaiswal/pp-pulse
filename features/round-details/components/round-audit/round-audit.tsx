"use client";

import { useState, useMemo, useEffect } from "react";
import { Gamepad2, TicketPercent, Terminal, CircleDollarSign, InfoIcon } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoundAuditSidebar } from "@/features/round-details/components/round-audit/round-audit-sidebar";
import { RoundAuditContent } from "@/features/round-details/components/round-audit/round-audit-content";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";

export default function RoundAudit() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { roundDetails } = useRoundDetails();
  const tabs = useMemo(() => {
    const items = [];
    if (roundDetails?.betInfo) items.push({ id: "bets", label: "Bet Details", icon: InfoIcon });
    if (roundDetails?.tptInfo?.length) items.push({ id: "tx", label: "Transactions", icon: CircleDollarSign });
    if (roundDetails) items.push({ id: "logs", label: "Kibana Logs", icon: Terminal });
    return items;
  }, [roundDetails]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const activeLabel = tabs.find((t) => t.id === activeTab)?.label || "";

  useEffect(() => {
  if (!activeTab && tabs.length > 0) {
    setActiveTab(tabs[0].id);
  }
}, [tabs, activeTab]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex w-full min-h-[calc(100vh-42vh)] max-h-screen bg-background border rounded-xl overflow-hidden shadow-md">
        <RoundAuditSidebar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <RoundAuditContent
          activeTab={activeTab}
          activeLabel={activeLabel}
          gameId={roundDetails?.betInfo?.[0]?.game_id || ""}
        />
      </div>
    </TooltipProvider>
  );
}