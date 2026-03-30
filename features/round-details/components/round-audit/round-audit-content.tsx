"use client";

import { BetTable, LogTerminal, TransactionTable } from "@/features/round-details/components/round-audit/round-audit-views";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ContentProps {
  activeTab: string;
  activeLabel: string;
  roundId: string;
  data: any;
}

export function RoundAuditContent({ activeTab, activeLabel, roundId, data }: ContentProps) {
  const { resolutionEditorOpen, setResolutionEditorOpen } = useRoundDetails();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-card/30">
      <header className="px-6 py-3 border-b flex items-center justify-between bg-background/50">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold truncate">{activeLabel}</h3>
          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/50">
            Game Id: {roundId.split("-").pop()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button title="Resolution Editor" variant="outline" size="xs" onClick={() => setResolutionEditorOpen(!resolutionEditorOpen)} className="gap-1">
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </header>

      <div className="flex-1 p-2 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "tx" && <TransactionTable transactions={data.transactions} />}
            {activeTab === "bets" && <BetTable items={data.bets} />}
            {activeTab === "logs" && <LogTerminal logs={data.logs} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}