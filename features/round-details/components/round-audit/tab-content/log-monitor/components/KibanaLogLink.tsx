// components/stored-queries/kibana-log-link.tsx
import React from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"; // Optional tool styling
import { useDynamicKibanaLink } from "../hooks/useDynamicKibanaLink";
import { cn } from "@/utils/cn";

interface KibanaLogLinkProps {
  logType: "platform" | "game";
  label?: string;
  className?: string;
}

export function KibanaLogLink({ logType, label, className }: KibanaLogLinkProps) {
  const { url, isLoading, hasTemplate } = useDynamicKibanaLink({ logType });

  if (isLoading) {
    return (
      <span className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        Locating query template...
      </span>
    );
  }

  // If no database query template matches the runtime contextual rules, hide or show placeholder
  if (!hasTemplate || !url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline transition-all duration-150",
        className
      )}
    >
      <span>{label || `Open ${logType === "platform" ? "Platform" : "Game"} Logs`}</span>
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}