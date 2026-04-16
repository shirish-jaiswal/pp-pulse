"use client";

import { useState } from "react";
import { LucideIcon, Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

export interface InfoItem {
  label: string;
  value: string | number;
  copyable?: boolean;
  link?: {
    href: string;
    target?: "_blank" | "_self";
  };
}

export interface InfoCardProps {
  items: InfoItem[];
  iName?: string;
  icon?: LucideIcon;
  className?: string;
  variant?: "default" | "error" | "success";
}

export default function InfoCard({
  items,
  icon: Icon,
  className,
  variant = "default",
}: InfoCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | "all" | null>(null);

  const isError = variant === "error";
  const isSuccess = variant === "success";

  const handleCopy = (text: string, index: number | "all") => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-3 py-2 border-2 bg-background/40 rounded-md",
        className
      )}
    >
      {/* ICON */}
      {Icon && (
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground",
            isError && "text-red-400",
            isSuccess && "text-emerald-400"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      )}

      {/* CONTENT */}
      <div className="flex flex-col gap-2 w-full min-w-0">

        {items.map((item, index) => (
          <div key={index} className="flex items-start justify-between gap-3">

            {/* TEXT */}
            <div className="min-w-0">
              <div className="text-[11px] text-muted-foreground">
                {item.label}
              </div>

              {item.link ? (
                <Link
                  href={item.link.href}
                  target={item.link.target || "_blank"}
                  className="text-sm font-mono text-foreground hover:underline"
                >
                  {item.value}
                </Link>
              ) : (
                <div
                  className={cn(
                    "text-sm font-mono truncate",
                    isError && "text-red-400",
                    isSuccess && "text-emerald-400"
                  )}
                >
                  {item.value}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 shrink-0">
              {item.copyable && (
                <button
                  onClick={() => handleCopy(String(item.value), index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copiedIndex === index ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}