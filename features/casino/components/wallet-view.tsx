import { OneWalletConfig } from "@/features/casino/types/one-wallet-config";
import { Globe, ShieldCheck, Zap, Activity, Database} from "lucide-react";

export function WalletView({ data }: { data: OneWalletConfig }) {
  const StatusRow = ({ label, value }: { label: string; value: number }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">{label}</span>
      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
        value === 1 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
      }`}>
        {value === 1 ? "ON" : "OFF"}
      </span>
    </div>
  );

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden font-sans">
      
      <div className="bg-slate-800 p-4 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none tracking-tight">OneWallet Integration</h2>
            <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase">{data.casinoId}</p>
          </div>
        </div>
        
        <div className="flex gap-4 border-l border-slate-700 pl-4">
          <div className="text-right">
            <p className="text-[9px] uppercase font-bold text-slate-500">Environment</p>
            <p className="text-xs font-mono font-bold text-emerald-400">v.{data.env}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase font-bold text-slate-500">UCID</p>
            <p className="text-xs font-mono font-bold text-blue-400">{data.ucid}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 mb-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold uppercase">Endpoint Details</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Gateway URL</label>
              <div className="mt-1 p-2 bg-slate-50 rounded border text-[11px] font-mono text-blue-600 break-all leading-relaxed">
                {data.url}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500 font-medium text-center">Group ID</span>
              <span className="text-xs font-bold bg-slate-100 px-2 rounded">{data.casinoGroup}</span>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Service Implementation</label>
              <p className="text-[10px] text-slate-600 leading-normal mt-1 italic wrap-break-word">{data.className}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4 bg-slate-50/30">
          <div className="flex items-center gap-2 text-slate-800 mb-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold uppercase">Settlement Logic</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded-lg border shadow-sm text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Standard</p>
              <p className="text-xl font-black text-slate-800 leading-none">{data.settleGameType}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border shadow-sm text-center border-b-2 border-b-destructive">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Cancel</p>
              <p className="text-xl font-black text-destructive leading-none">{data.cancelGameType}</p>
            </div>
          </div>
          <div className="pt-2">
            <StatusRow label="Settle Lost Games" value={data.settleLostGame} />
            <StatusRow label="Session Trimming" value={data.trimSession} />
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 mb-2">
            <Database className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase">Data Transmission</span>
          </div>
          <div className="space-y-1">
            <StatusRow label="Extra Data (Bet)" value={data.extraDataOnBet} />
            <StatusRow label="Extra Data (Win)" value={data.extraDataOnWin} />
            <StatusRow label="Extra Data (DF)" value={data.extraDataOnDF} />
          </div>
          <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Activity className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Parameters</span>
            </div>
            <p className="text-xs font-mono text-blue-800">{data.params}</p>
          </div>
        </div>
      </div>
    </div>
  );
}