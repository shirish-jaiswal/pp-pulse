"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Copy, Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface InfoItem {
  label: string;
  value: string | number;
  copyable?: boolean;
}

interface InfoCardProps {
  items: InfoItem[];
  icon?: LucideIcon;
  iconBgClass?: string;
  className?: string;
  variant?: "default" | "error";
}

const InfoCard = ({
  items,
  icon: Icon,
  iconBgClass = "bg-slate-100 text-slate-600",
  className,
  variant = "default",
}: InfoCardProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | "all" | null>(null);

  const isAllCopyable = items.every((item) => item.copyable);
  const isError = variant === "error";

  const handleCopy = (text: string, index: number | "all") => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllText = items.map((i) => `${i.label}: ${i.value}`).join("\n");

  return (
    <Card
      className={cn(
        "group relative border-none transition-all bg-white ring-1 ring-slate-200/60 shadow-md hover:ring-slate-300 py-2",
        isError && "bg-red-50/50 ring-red-100",
        className
      )}
    >
      {/* 1. GLOBAL COPY BUTTON: Only if ALL are copyable */}
      {isAllCopyable && (
        <button
          onClick={() => handleCopy(copyAllText, "all")}
          className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full border border-slate-200 bg-slate-50 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-100"
        >
          {copiedIndex === "all" ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Copy className="h-3 w-3 text-slate-400" />
          )}
        </button>
      )}

      <CardContent className="px-2 flex items-start gap-2">
        {Icon && (
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", iconBgClass, isError && "bg-red-100 text-red-600")}>
            <Icon className="h-4 w-4" />
          </div>
        )}

        <div className="flex flex-col gap-y-3 w-full min-w-0 pr-4">
          {items.map((item, index) => (
            <div key={index} className="group/item relative">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-0.5">
                {item.label}
              </p>
              <div className="flex items-center gap-2">
                <p className={cn("text-sm font-mono truncate leading-none", isError ? "text-red-700 font-bold" : "text-slate-700")}>
                  {item.value}
                </p>

                {/* 2. INDIVIDUAL COPY BUTTON: Only if NOT all are copyable AND this specific item is */}
                {!isAllCopyable && item.copyable && (
                  <button
                    onClick={() => handleCopy(String(item.value), index)}
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;