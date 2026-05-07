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
    <div className="w-full flex items-center justify-between rounded-xl border bg-background px-3 py-2 shadow-sm">

      {/* METADATA */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-1">
        {gameMetadata.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 text-sm"
          >
            {/* Label */}
            <span className="text-xs text-muted-foreground">
              {item.label}
            </span>

            {/* Value */}
            <span
              className={cn(
                "font-medium",
                item.isTechnical && "font-mono text-foreground"
              )}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* COPY BUTTON */}
      <button
        onClick={handleCopy}
        className="ml-3 flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default GameMetadata;