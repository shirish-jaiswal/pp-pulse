"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Edit } from "lucide-react";
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

const pillBase =
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors";

export function RoundAuditContent({
  activeTab,
  activeLabel,
  gameId,
}: ContentProps) {
  const { roundDetails, resolutionEditorOpen, setResolutionEditorOpen } =
    useRoundDetails();

  const [copied, setCopied] = useState(false);
  const shortId = gameId.split("-").pop();
  const sharedLogState = useLogState();

  // Create references for each section to enable scrolling
  const betsRef = useRef<HTMLDivElement>(null);
  const txRef = useRef<HTMLDivElement>(null);
  const logsRef = useRef<HTMLDivElement>(null);

  usePrefetchTransactionLogs({
    roundId: roundDetails?.tptInfo?.[0]?.round_id as string,
    timeStamp: roundDetails?.tptInfo?.[0]?.trans_date as string,
    game_id: roundDetails?.tptInfo?.[0]?.game_id as string,
    user_id: roundDetails?.tptInfo?.[0]?.user_id as string,
    game_type: roundDetails?.gameDetails?.[0]?.game_type as string,
    operator: roundDetails?.tptInfo?.[0]?.Wallet_Type.toLowerCase() as string,
  });

  // Listen to activeTab changes and trigger smooth scrolling
  useEffect(() => {
    const targetRef = 
      activeTab === "bets" ? betsRef : 
      activeTab === "tx" ? txRef : 
      activeTab === "logs" ? logsRef : null;

    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Failed to copy Game ID");
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-card/40 border-border/40 overflow-hidden font-sans">
      <header className="flex bg-card-foreground/10 items-center justify-between px-2 py-2 border-b border-border/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 min-w-0">
          <h3 className="text-sm font-semibold text-foreground tracking-tight truncate">
            {activeLabel}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Game
            </span>
            <button
              onClick={handleCopy}
              className={`${pillBase} gap-1 bg-muted/30 hover:bg-muted/50 border-border/30`}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 opacity-70" />
                  {shortId}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setResolutionEditorOpen(!resolutionEditorOpen)}
            className="gap-2 rounded-md bg-primary/90 hover:bg-primary transition"
          >
            <Edit className="h-4 w-4" />
            Editor
          </Button>
        </div>
      </header>

      <div className="flex-1 p-3 overflow-y-auto max-h-[57vh] space-y-4 scroll-smooth">
        
        {/* Section 1: Bets */}
        <div ref={betsRef} className="scroll-mt-2">
          <FullScreenWrapper
            title="Bet History"
            description="Player wagers overview"
          >
            <BetTable items={roundDetails?.betInfo} />
          </FullScreenWrapper>
        </div>

        {/* Section 2: Transactions */}
        <div ref={txRef} className="scroll-mt-2">
          <FullScreenWrapper
            title="Transaction Audit"
            description="Transaction logs"
          >
            <TransactionTable transactions={roundDetails?.tptInfo} />
          </FullScreenWrapper>
        </div>

        {/* Section 3: Execution Logs */}
        <div ref={logsRef} className="scroll-mt-4">
          <FullScreenWrapper title="Execution Logs">
            <PremiumLogMonitor
              roundId={roundDetails?.tptInfo?.[0]?.round_id || ""}
              timeStamp={roundDetails?.tptInfo?.[0]?.trans_date || ""}
              sharedState={sharedLogState}
            />
          </FullScreenWrapper>
        </div>

      </div>
    </div>
  );
}