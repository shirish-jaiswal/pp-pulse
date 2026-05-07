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
          <div
            key={index}
            className="flex items-center justify-between gap-4"
          >
            {/* TEXT */}
            <div className="min-w-0">
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
                <div className="text-sm font-medium break-all">
                  {renderValue(item.value)}
                </div>
              )}
            </div>

            {/* ACTION */}
            {item.copyable && (
              <button
                onClick={() =>
                  handleCopy(getCopyText(item.value), index)
                }
                className="p-1.5 rounded-md hover:bg-muted transition"
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
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

  return <span className="text-foreground">{value}</span>;
}