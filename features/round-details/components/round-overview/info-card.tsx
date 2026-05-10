"use client";

import React, { ReactNode, useState } from "react";
import { LucideIcon, Copy, Check, ExternalLink } from "lucide-react"; // Added ExternalLink for visual cue
import { cn } from "@/utils/cn";
import Link from "next/link";

export interface InfoLink {
  href: string;
  target?: "_blank" | "_self";
}

export interface ValueType {
  label: string;
  variant: InfoCardVariant;
}

export interface InfoItem {
  label: string;
  value: ReactNode | ValueType[];
  copyable?: boolean;
  link?: InfoLink;
  actionComponent?: ReactNode;
}

export type InfoCardVariant = "default" | "error" | "success";

export interface InfoCardProps {
  iName?: string;
  items: InfoItem[];
  icon?: LucideIcon;
  isIconButton?: boolean;
  className?: string;
  variant?: InfoCardVariant;
}

export default function InfoCard({
  items,
  icon: Icon,
  className,
  isIconButton,
  variant = "default",
}: InfoCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  // Track which item's action component is currently active/open
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(null);

  const isError = variant === "error";
  const isSuccess = variant === "success";

  const handleCopy = (e: React.MouseEvent, text: string, index: number) => {
    e.stopPropagation(); // Prevent triggering links or buttons underneath
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
        "flex items-start gap-2 p-2 rounded-xl border bg-background shadow-sm hover:shadow-md transition",
        className
      )}
    >
      {/* ICON */}
      {Icon && (
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg bg-muted",
            isError && "bg-red-500/10 text-red-400",
            isSuccess && "bg-emerald-500/10 text-emerald-400"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      )}

      {/* CONTENT */}
      <div className="flex flex-col gap-3 w-full min-w-0">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground mb-0.5">
                {item.label}
              </div>

              {item.link ? (
                <Link
                  href={item.link.href}
                  target={item.link.target || "_blank"}
                  className="text-sm font-medium hover:underline break-all"
                >
                  {renderValue(item.value)}
                </Link>
              ) : (
                <div className="text-sm font-medium break-all text-foreground">
                  {renderValue(item.value)}
                </div>
              )}
            </div>

            {/* ACTIONS SECTION */}
            <div className="flex items-center gap-1">
              {/* COPY BUTTON */}
              {item.copyable && (
                <button
                  onClick={(e) => handleCopy(e, getCopyText(item.value), index)}
                  className="p-1.5 rounded-md hover:bg-muted transition"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              )}

              {/* DYNAMIC ACTION COMPONENT TRIGGER */}
              {isIconButton && item.actionComponent && (
                <div className="relative">
                  <button
                    onClick={() => setActiveActionIndex(activeActionIndex === index ? null : index)}
                    className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>

                  {/*
                    This renders the component passed in props.
                    If it's a Modal/Dialog, it usually handles its own portal/overlay.
                    If it's a dropdown, you might want to wrap it in a visibility check.
                  */}
                  {activeActionIndex === index && (
                    <div className="absolute right-0 z-50">
                       {item.actionComponent}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  return <span>{value}</span>;
}