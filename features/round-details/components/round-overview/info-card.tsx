"use client";

import React, { ReactNode, useState, ComponentType } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

export interface InfoLink {
  href: string;
  target?: "_blank" | "_self";
}

export type InfoCardVariant = "default" | "error" | "success" | "info" | "warning";

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

// Robust text-based badge placeholder component
export function DynamicTextIcon({ text }: { text: string }) {
  const displayText = text.slice(0, 3).toUpperCase();
  return (
    <span className="text-[10px] font-bold tracking-wider leading-none text-center block select-none">
      {displayText}
    </span>
  );
}

export interface InfoCardProps {
  iName?: string | ComponentType<{ className?: string }>; // Updated to allow strings
  items: InfoItem[];
  icon?: ComponentType<{ className?: string }> | ReactNode | string;
  isIconButton?: boolean;
  className?: string;
  variant?: InfoCardVariant;
}

export default function InfoCard({
  items,
  icon,
  className,
  isIconButton,
  variant = "default",
}: InfoCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(null);

  const isError = variant === "error";
  const isSuccess = variant === "success";
  const isInfo = variant === "info";
  const isWarning = variant === "warning";

  const handleCopy = (e: React.MouseEvent, text: string, index: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const getCopyText = (value: InfoItem["value"]) => {
    if (Array.isArray(value)) return value.map((v) => v.label).join(" | ");
    return String(value);
  };

  // Safe Icon Rendering Engine
  const renderIcon = () => {
    if (!icon) return null;

    const iconClassName = "h-4 w-4 shrink-0";

    // 1. If it's a raw string (e.g., "SW"), render our text badge
    if (typeof icon === "string") {
      return <DynamicTextIcon text={icon} />;
    }

    // 2. If it's an instantiated JSX element
    if (React.isValidElement(icon)) {
      return icon;
    }

    // 3. If it's a component constructor class (Lucide Icon Components)
    const IconComponent = icon as ComponentType<{ className?: string }>;
    return <IconComponent className={iconClassName} />;
  };

  return (
    <div className={cn("flex items-start gap-2 rounded-xl border bg-background p-2 shadow-sm transition hover:shadow-md", className)}>
      {/* ICON WINDOW */}
      {icon && (
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
            isError && "bg-red-500/10 text-red-400",
            isSuccess && "bg-emerald-500/10 text-emerald-400",
            isInfo && "bg-blue-500/10 text-blue-400",
            isWarning && "bg-orange-500/10 text-orange-400"
          )}
        >
          {renderIcon()}
        </div>
      )}

      {/* CONTENT */}
      <div className="flex min-w-0 w-full flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-xs text-muted-foreground">{item.label}</div>
              {item.link ? (
                <Link href={item.link.href} target={item.link.target || "_blank"} className="break-all text-sm font-medium hover:underline">
                  {renderValue(item.value)}
                </Link>
              ) : (
                <div className="break-all text-sm font-medium text-foreground">{renderValue(item.value)}</div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-1">
              {item.copyable && (
                <button onClick={(e) => handleCopy(e, getCopyText(item.value), index)} className="rounded-md p-1.5 transition hover:bg-muted">
                  {copiedIndex === index ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
              )}
              {isIconButton && item.actionComponent && (
                <div className="relative">
                  <button onClick={() => setActiveActionIndex(activeActionIndex === index ? null : index)} className="rounded-md p-1.5 text-primary transition hover:bg-primary/10">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  {activeActionIndex === index && <div className="absolute right-0 z-50">{item.actionComponent}</div>}
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
        val.variant === "error" ? "text-red-400" :
        val.variant === "success" ? "text-emerald-400" :
        val.variant === "info" ? "text-blue-400" :
        val.variant === "warning" ? "text-orange-400" : "text-foreground";

      return (
        <span key={i}>
          <span className={cn(colorClass)}>{val.label}</span>
          {i < value.length - 1 && <span className="mx-1 text-muted-foreground">|</span>}
        </span>
      );
    });
  }
  return <span>{value}</span>;
}