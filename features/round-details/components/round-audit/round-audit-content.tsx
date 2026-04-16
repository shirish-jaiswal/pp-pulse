"use client";

import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Copy, Edit } from "lucide-react";
import BetTable from "@/features/round-details/components/round-audit/tab-content/bet-details";
import TransactionTable from "@/features/round-details/components/round-audit/tab-content/transaction-table";
import { useState } from "react";
import FullScreenWrapper from "@/features/round-details/components/round-audit/tab-content/full-screen-wrapper";
import PremiumLogMonitor from "./tab-content/log-terminal";

interface ContentProps {
  activeTab: string;
  activeLabel: string;
  gameId: string;
}

export function RoundAuditContent({ activeTab, activeLabel, gameId }: ContentProps) {
  const { roundDetails, resolutionEditorOpen, setResolutionEditorOpen } = useRoundDetails();
  const [copied, setCopied] = useState(false);
  const shortId = gameId.split("-").pop();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-card/20 max-h-[calc(100vh-16rem)]">

      {/* HEADER */}
      <header className="px-6 py-2.5 border-b border-border/50 flex items-center justify-between bg-card-foreground/10">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* Title */}
          <h3 className="text-sm font-medium text-foreground">
            {activeLabel}
          </h3>

          {/* Game ID */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border/40 bg-muted/20 text-xs font-mono text-muted-foreground hover:bg-accent/30 transition-colors"
            title="Copy full Game ID"
          >
            <p>Game ID : <span>{shortId}</span> </p>
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 opacity-50" />
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

      {/* CONTENT */}
      <div className="flex-1 p-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.12 }}
          >
            {activeTab === "bets" && (
              <FullScreenWrapper
                title="Bet History"
                description="Player wagers overview"
              >
                <BetTable items={roundDetails?.betInfo} />
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
                  roundId={roundDetails?.betInfo?.[0].round_id || ""}
                  timeStamp={roundDetails?.betInfo?.[0].betting_req_time || ""}
                />
              </FullScreenWrapper>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}