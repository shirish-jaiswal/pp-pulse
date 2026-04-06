"use client";

import { useState, useMemo } from "react";
import { Gamepad2, TicketPercent, Terminal, CircleDollarSign, InfoIcon } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoundAuditSidebar } from "./round-audit-sidebar";
import { RoundAuditContent } from "./round-audit-content";

interface RoundAuditProps {
  data: {
    transactions?: any[];
    bets?: any[];
    progression?: any[];
    promos?: any[];
    logs?: any[];
  };
}

export default function RoundAudit({ data }: RoundAuditProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const tabs = useMemo(() => {
    const items = [];
    if (data.bets?.length) items.push({ id: "bets", label: "Bet Details", icon: InfoIcon });
    if (data.transactions?.length) items.push({ id: "tx", label: "Transactions", icon: CircleDollarSign });
    if (data.progression?.length) items.push({ id: "prog", label: "Progression", icon: Gamepad2 });
    if (data.promos?.length) items.push({ id: "promo", label: "Promos", icon: TicketPercent });
    if (data.logs?.length) items.push({ id: "logs", label: "Kibana Logs", icon: Terminal });
    return items;
  }, [data]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const activeLabel = tabs.find((t) => t.id === activeTab)?.label || "";

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex w-full min-h-fit max-h-screen bg-background border rounded-xl overflow-hidden shadow-md">
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
          gameId={"shirish"}
          data={data}
        />
      </div>
    </TooltipProvider>
  );
}