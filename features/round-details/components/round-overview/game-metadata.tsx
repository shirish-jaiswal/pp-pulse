import { useState } from "react";
import { cn } from "@/utils/cn";
import { Copy, Check } from "lucide-react";
import { useRoundDetails } from "../../context/round-details-context";

const GameMetadata = () => {
  const [copied, setCopied] = useState(false);

  const { gameMetadata } = useRoundDetails();

  const handleCopy = () => {
    if (!gameMetadata) return;
    const textToCopy = gameMetadata
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!gameMetadata) return null;
  return (
    <div className="w-full flex items-center border-2 bg-muted/20 rounded-md">

      {/* METADATA */}
      <div className="flex-1 flex items-center overflow-x-auto no-scrollbar px-2 py-2">
        {gameMetadata.map((item, index) => (
          <div key={index} className="flex items-center shrink-0">

            <div className="flex items-baseline gap-1.5 px-1">

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
            {index !== gameMetadata.length - 1 && (
              <div className="h-3 w-px bg-border mx-1" />
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