"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import BetTable from "@/features/round-details/components/round-audit/tab-content/bet-details";
import PremiumLogMonitor from "@/features/round-details/components/round-audit/tab-content/log-monitor";
import TransactionTable from "@/features/round-details/components/round-audit/tab-content/transaction-table";
import FullScreenWrapper from "@/features/round-details/components/round-audit/tab-content/full-screen-wrapper";
import { usePrefetchTransactionLogs } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-prefetch-logs";
import { useLogState } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-log-state";
import { toast } from "sonner";

interface ContentProps {
  activeTab: string;
  activeLabel: string;
  gameId: string;
}

export function RoundAuditContent({ activeTab, activeLabel, gameId }: ContentProps) {
  const { roundDetails, resolutionEditorOpen, setResolutionEditorOpen } = useRoundDetails();
  const [copied, setCopied] = useState(false);
  const shortId = gameId.split("-").pop();

  const sharedLogState = useLogState();

  usePrefetchTransactionLogs({
    roundId: roundDetails?.tptInfo?.[0]?.round_id,
    timeStamp: roundDetails?.tptInfo?.[0]?.trans_date,
    game_id: roundDetails?.tptInfo?.[0]?.game_id,
    user_id: roundDetails?.tptInfo?.[0]?.user_id,
    game_type: roundDetails?.gameDetails?.[0]?.game_type,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy Game ID");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-card/10 max-h-[calc(100dvh-30dvh)]">
      <header className="px-6 py-2.5 flex items-center justify-between bg-card-foreground/5">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-foreground/90">{activeLabel}</h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/30 text-xs font-mono text-muted-foreground hover:bg-accent/30 transition-colors"
            title="Copy full Game ID"
          >
            <p>Game ID : <span className="text-foreground/70">{shortId}</span></p>
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 opacity-40" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            title="Resolution Editor"
            variant="default"
            size="sm"
            onClick={() => setResolutionEditorOpen(!resolutionEditorOpen)}
            className="gap-1 text-white/80 hover:text-white rounded-full py-0"
          >
            <Edit className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="flex-1 p-2 pt-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.12 }}
          >
            {activeTab === "bets" && (
              <FullScreenWrapper title="Bet History" description="Player wagers overview">
                <div className="gap-2 flex flex-col">
                  <BetTable items={roundDetails?.betInfo} />
                </div>
              </FullScreenWrapper>
            )}

            {activeTab === "tx" && (
              <FullScreenWrapper title="Transaction Audit" description="Transaction logs">
                <TransactionTable transactions={roundDetails?.tptInfo} />
              </FullScreenWrapper>
            )}

            {activeTab === "logs" && (
              <FullScreenWrapper title="Execution Logs">
                <PremiumLogMonitor
                  roundId={roundDetails?.tptInfo?.[0]?.round_id || ""}
                  timeStamp={roundDetails?.tptInfo?.[0]?.trans_date || ""}
                  sharedState={sharedLogState}
                />
              </FullScreenWrapper>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}