import { useMemo, useState, useRef, useEffect } from "react";
import { Search, Copy, Check } from "lucide-react";

type LogLevel = "INFO" | "SUCCESS" | "WARN" | "ERROR" | "CRITICAL";

interface Log {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  origin?: string;
}

const levelConfig: Record<LogLevel, { color: string; border: string }> = {
  INFO: { color: "text-zinc-400", border: "border-zinc-600" },
  SUCCESS: { color: "text-emerald-400", border: "border-emerald-500" },
  WARN: { color: "text-amber-400", border: "border-amber-500" },
  ERROR: { color: "text-red-400", border: "border-red-500" },
  CRITICAL: { color: "text-pink-400", border: "border-pink-500" },
};

const fallbackConfig = { color: "text-zinc-500", border: "border-zinc-800" };

function formatRelative(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function highlight(text: string, query: string) {
  if (!query || !text) return text || "";
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-emerald-500/20 text-emerald-300">
        {p}
      </span>
    ) : (
      p
    )
  );
}

export default function PremiumLogMonitor({ logs = [] }: { logs: Log[] }) {
  const [query, setQuery] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [levelFilter, setLevelFilter] = useState<LogLevel[]>([]);
  const [relativeTime, setRelativeTime] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = Array.isArray(logs) ? logs : [];
    if (levelFilter.length) {
      result = result.filter((l) => levelFilter.includes(l.level));
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((l) => l.message?.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => a.timestamp - b.timestamp);
  }, [logs, query, levelFilter]);

  useEffect(() => {
    if (isLive && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filtered, isLive]);

  const toggleLevel = (level: LogLevel) => {
    setLevelFilter((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const copyAll = () => {
    const text = filtered
      .map((l) => `[${new Date(l.timestamp).toISOString()}] ${l.level}: ${l.message}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-200 flex flex-col font-mono">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-4 shrink-0">
        <div className="text-lg font-semibold tracking-wide">LOG STREAM</div>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={copyAll}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors shrink-0"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="p-3 border-b border-zinc-800 flex items-center gap-2 flex-wrap shrink-0">
        {(["INFO", "SUCCESS", "WARN", "ERROR", "CRITICAL"] as LogLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => toggleLevel(lvl)}
            className={`px-2 py-1 rounded text-[10px] uppercase font-bold border transition-all ${
              levelFilter.includes(lvl)
                ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
            }`}
          >
            {lvl}
          </button>
        ))}

        <button
          onClick={() => setRelativeTime((v) => !v)}
          className="ml-auto text-xs text-zinc-500 hover:text-zinc-300"
        >
          {relativeTime ? "Showing Relative" : "Showing UTC"}
        </button>
      </div>

      {/* LOG LIST */}
      <div
        ref={scrollRef}
        onWheel={() => isLive && setIsLive(false)}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600 italic">
            No logs found
          </div>
        ) : (
          filtered.map((log, index) => {
            // SAFE ACCESS: Fallback to fallbackConfig if log.level is unknown
            const config = levelConfig[log.level] || fallbackConfig;

            return (
              <div
                key={`${log.id || 'log'}-${index}`} // Composite key to prevent duplication errors
                className={`border-l-4 ${config.border} px-4 py-1.5 hover:bg-white/2 transition-colors border-b border-zinc-900/50`}
              >
                <div className="flex gap-4 text-[13px] items-start">
                  <div className="w-24 shrink-0 tabular-nums text-zinc-500 pt-0.5">
                    {relativeTime
                      ? formatRelative(log.timestamp)
                      : new Date(log.timestamp).toISOString().split("T")[1].split("Z")[0]}
                  </div>

                  <div className={`w-20 shrink-0 font-bold ${config.color} pt-0.5`}>
                    {log.level || "LOG"}
                  </div>

                  <div className="flex-1 leading-relaxed break-all">
                    {highlight(log.message || "", query)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      <div className="px-4 py-2 border-t border-zinc-800 text-[11px] flex justify-between items-center bg-zinc-950 shrink-0">
        <div className="flex gap-4 text-zinc-500">
          <span>{filtered.length} logs matching</span>
          {levelFilter.length > 0 && (
            <span
              className="text-amber-500/80 underline decoration-dotted cursor-pointer"
              onClick={() => setLevelFilter([])}
            >
              Clear Filters
            </span>
          )}
        </div>
        <span className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isLive ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-zinc-700"
            }`}
          />
          <span className={isLive ? "text-emerald-500 font-bold" : "text-zinc-500"}>
            {isLive ? "LIVE" : "PAUSED"}
          </span>
        </span>
      </div>
    </div>
  );
}