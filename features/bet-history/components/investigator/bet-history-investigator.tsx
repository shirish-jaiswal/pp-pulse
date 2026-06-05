"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BetHistoryForm } from "@/features/bet-history/components/investigator/bet-history-form";
import { useBetHistory } from "@/features/bet-history/context/bet-history-context";
export function BetHistoryInvestigator() {
    const router = useRouter();
    const { input } = useBetHistory();


    useEffect(() => {
        router.push("/player-history?playerId=" + input.playerId + "&from=" + input.from + "&to=" + input.to);
        router.refresh();
    }, [router, input]);


    return (
        <Card className="shadow-lg border-border/60 p-0 bg-background-muted">
            <CardContent className="p-2 pb-0 space-y-2">
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80 inline-flex items-center gap-1.5">
                            Player Bet History
                            <span className="text-[10px] font-bold normal-case tracking-normal px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 ml-0.5">
                                Max 48h
                            </span>
                        </span>
                    </div>
                </div>
                <BetHistoryForm />
            </CardContent>
        </Card>
    );
}