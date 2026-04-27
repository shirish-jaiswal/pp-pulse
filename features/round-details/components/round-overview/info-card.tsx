"use client";

import React, { ReactNode, useState } from "react";
import { LucideIcon, Copy, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

/**
 * External link configuration
 */
export interface InfoLink {
  href: string;
  target?: "_blank" | "_self";
}

export interface ValueType {
  label: string;
  variant: InfoCardVariant;
}

/**
 * Single row item inside a card
 */
export interface InfoItem {
  label: string;
  value: ReactNode | ValueType[];
  copyable?: boolean;
  link?: InfoLink;
}

/**
 * Visual state of the card
 */
export type InfoCardVariant = "default" | "error" | "success";

/**
 * Info card container
 */
export interface InfoCardProps {
  iName?: string;
  items: InfoItem[];

  /** Icon */
  icon?: LucideIcon;

  className?: string;
  variant?: InfoCardVariant;
}

export default function InfoCard({
  items,
  icon: Icon,
  className,
  variant = "default",
}: InfoCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isError = variant === "error";
  const isSuccess = variant === "success";

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const getCopyText = (value: InfoItem["value"]) => {
    if (Array.isArray(value)) {
      return value.map((v) => v.label).join(" | ");
    }
    return String(value);
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
                  {renderValue(item.value)}
                </Link>
              ) : (
                <div className="text-sm font-mono truncate">
                  {renderValue(item.value)}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 shrink-0">
              {item.copyable && (
                <button
                  onClick={() =>
                    handleCopy(getCopyText(item.value), index)
                  }
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

/**
 * Render value (handles ValueType[])
 */
function renderValue(value: InfoItem["value"]) {
  if (Array.isArray(value)) {
    return value.map((val, i) => {
      const colorClass =
        val.variant === "error"
          ? "text-red-400"
          : val.variant === "success"
          ? "text-emerald-400"
          : "text-foreground";

      return (
        <span key={i}>
          <span className={cn(colorClass)}>{val.label}</span>

          {i < value.length - 1 && (
            <span className="mx-1 text-muted-foreground">|</span>
          )}
        </span>
      );
    });
  }

  return <span className="text-foreground">{value}</span>;
}