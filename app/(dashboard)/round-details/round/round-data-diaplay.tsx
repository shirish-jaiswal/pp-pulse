"use client";

import React from "react";
import { 
  Hash, Coins, Wallet, Activity 
} from "lucide-react";
import StatCard from "@/app/(dashboard)/round-details/round/stat-cards";
import { TransactionLedger } from "@/app/(dashboard)/round-details/round/transaction-ledger";
import { RoundInformation } from "./round-information";
import { BettingDetailsTable } from "./beting-details-table";

interface RoundDetailsDisplayProps {
  data: any; // Consider replacing 'any' with your specific API response type
}

export function RoundDataDisplay({ data }: RoundDetailsDisplayProps) {
  const bets = data?.bets?.betsAndPlayerInfoList || [];
  const settlements = data?.settlements?.txnSettlementsList || [];
  const common = bets[0] || {};
  
  const totalBet = bets.reduce((acc: number, b: any) => acc + parseFloat(b.betAmount || "0"), 0);
  const totalWin = bets.reduce((acc: number, b: any) => acc + parseFloat(b.winAmount || "0"), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <StatCard label="Round ID" value={data.exists.roundId} icon={Hash} />
        <StatCard
          label="Total Round Bet"
          value={`${common.betCurrency || ""}${totalBet.toFixed(2)}`}
          icon={Coins}
          iconBgClass="bg-indigo-600"
        />
        <StatCard
          label="Total Round Win"
          value={`${common.betCurrency || ""}${totalWin.toFixed(2)}`}
          icon={Wallet}
          iconBgClass={totalWin > 0 ? "bg-emerald-500" : "bg-slate-400"}
          className={totalWin > 0 ? "bg-emerald-50 ring-emerald-200" : "bg-slate-50 ring-slate-200"}
        />
        <StatCard 
          label="Game Type" 
          value={common.gameType || "N/A"} 
          icon={Activity} 
          iconBgClass="bg-blue-600" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
        {/* Main Content Area */}
        <div className="xl:col-span-3 space-y-3">
          <BettingDetailsTable
            bets={bets}
            gameMode={common.gameMode}
            tableId={common.tableId}
          />
          <TransactionLedger settlements={settlements} />
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <RoundInformation data={data} common={common} />
        </div>
      </div>
    </div>
  );
}