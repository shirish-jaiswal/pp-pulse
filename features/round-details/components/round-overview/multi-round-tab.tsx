"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { cn } from "@/utils/cn";
import { Copy, Check, Loader2 } from "lucide-react";

export function MultiRoundTabs() {
  const { multiRoundIds } = useRoundDetails();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTabChange = async (roundId: string) => {
    if (!roundId) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(multiRoundIds.join(", ")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (multiRoundIds.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg text-sm text-muted-foreground">
        No round IDs added
      </div>
    );
  }

  return (
    <div className="flex items-center border rounded-lg bg-background">
      <Tabs
        defaultValue={multiRoundIds[0]}
        onValueChange={handleTabChange}
        className="flex-1"
      >
        <TabsList className="flex w-full justify-start overflow-x-auto no-scrollbar">
          {multiRoundIds.map((id, index) => (
            <TabsTrigger
              key={id}
              value={id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm",
                "data-[state=active]:bg-background data-[state=active]:text-foreground"
              )}
            >
              <span className="font-mono text-xs">
                {id}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 px-2 border-l">
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        )}

        <button
          onClick={handleCopy}
          className="p-2 rounded-md hover:bg-muted transition"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
