"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import BetTable from "@/features/round-details/components/round-audit/tab-content/bet-details";
import PremiumLogMonitor from "@/features/round-details/components/round-audit/tab-content/log-monitor";
import TransactionTable from "@/features/round-details/components/round-audit/tab-content/transaction-table";
import FullScreenWrapper from "@/features/round-details/components/round-audit/tab-content/full-screen-wrapper";
import AddationalDetailsWrapper from "@/features/round-details/components/round-audit/tab-content/addational-details-wrapper";
import { toast } from "sonner";
import { usePrefetchTransactionLogs } from "./tab-content/log-monitor/hooks/use-prefetch-logs";

interface ContentProps {
  activeTab: string;
  activeLabel: string;
  gameId: string;
}

export function RoundAuditContent({ activeTab, activeLabel, gameId }: ContentProps) {
  const { roundDetails, resolutionEditorOpen, setResolutionEditorOpen } = useRoundDetails();
  const [copied, setCopied] = useState(false);
  const shortId = gameId.split("-").pop();

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
          <h3 className="text-sm font-medium text-foreground/90">
            {activeLabel}
          </h3>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/30 text-xs font-mono text-muted-foreground hover:bg-accent/30 transition-colors"
            title="Copy full Game ID"
          >
            <p>Game ID : <span className="text-foreground/70">{shortId}</span> </p>
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 opacity-40" />
            )}
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1">
          <Button
            title="Resolution Editor"
            variant="ghost"
            size="xs"
            onClick={() => setResolutionEditorOpen(!resolutionEditorOpen)}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <Edit className="h-3.5 w-3.5" />
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
              <FullScreenWrapper
                title="Bet History"
                description="Player wagers overview"
              >
                <div className="gap-2 flex flex-col">
                  <BetTable items={roundDetails?.betInfo} />
                  <AddationalDetailsWrapper
                    items={roundDetails?.cardDetails}
                    isCardGame={roundDetails?.isCardGame}
                  />
                </div>
              </FullScreenWrapper>
            )}

            {activeTab === "tx" && (
              <FullScreenWrapper
                title="Transaction Audit"
                description="Transaction logs"
              >
                <TransactionTable transactions={roundDetails?.tptInfo} />
              </FullScreenWrapper>
            )}

            {activeTab === "logs" && (
              <FullScreenWrapper title="Execution Logs">
                <PremiumLogMonitor
                  roundId={roundDetails?.tptInfo?.[0].round_id || ""}
                  timeStamp={roundDetails?.tptInfo?.[0].trans_date || ""}
                />
              </FullScreenWrapper>
            )}

            {activeTab === "addationalDetails" && (
              <FullScreenWrapper title="Additional Details">
                <AddationalDetailsWrapper
                  items={roundDetails?.cardDetails}
                  isCardGame={roundDetails?.isCardGame}
                />
              </FullScreenWrapper>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}