import { useState } from "react";
import { cn } from "@/utils/cn";
import { Copy, Check } from "lucide-react";

const GameMetadata = () => {
  const [copied, setCopied] = useState(false);

  const data = [
    { label: "Game Type", value: "Free Bet Blackjack", isTechnical: false },
    { label: "Session Time", value: "2026-03-21 06:05:13.977", isTechnical: true },
    { label: "Table ID", value: "fbj0000000000092", isTechnical: true },
    { label: "Table Name", value: "SO-BJ-06.2", isTechnical: true },
    { label: "Mega Slot", value: "--", isTechnical: false },
    { label: "Mega Multiplier", value: "--", isTechnical: false },
    { label: "Platform", value: "Blackjack Mobile", isTechnical: false },
  ];

  const handleCopy = () => {
    const textToCopy = data
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full flex items-center border-2 bg-muted/20 rounded-md">

      {/* METADATA */}
      <div className="flex-1 flex items-center overflow-x-auto no-scrollbar px-2 py-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center shrink-0">

            <div className="flex items-baseline gap-1.5 px-3">

              {/* Label */}
              <span className="text-[11px] text-muted-foreground">
                {item.label}
              </span>

              {/* Value */}
              <span
                className={cn(
                  "text-[12px] whitespace-nowrap",
                  item.isTechnical
                    ? "font-mono text-foreground"
                    : "text-foreground"
                )}
              >
                {item.value}
              </span>
            </div>

            {/* Divider */}
            {index !== data.length - 1 && (
              <div className="h-3 w-px bg-border/40 mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* COPY BUTTON */}
      <div className="px-2 border-l border-border/40">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/40 transition"
          title="Copy metadata"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px]">Copied</span>
            </>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default GameMetadata;