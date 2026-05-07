"use client"

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import { EyeOffIcon, CopyIcon, TrashIcon, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface MatchPhrasePillProps {
  phrase: { key: string; value: string; isPositive?: boolean; isDisabled?: boolean };
  index: number;
  onRemove: (idx: number) => void;
  onToggleDisable: (idx: number) => void;
}

export const KibanaFilterPill: React.FC<MatchPhrasePillProps> = ({
  phrase,
  index,
  onRemove,
  onToggleDisable,
}) => {
  const copyValue = (text: string) => navigator.clipboard.writeText(text);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Badge
          variant={phrase.isDisabled ? "outline" : phrase.isPositive ? "secondary" : "destructive"}
          className={cn(
            "gap-1 pl-2 pr-1 py-0.5 text-[11px] font-medium cursor-pointer transition-opacity flex items-center",
            phrase.isDisabled && "opacity-50 grayscale",
            !phrase.isDisabled && phrase.isPositive && "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          )}
        >
          <span className="opacity-70">{phrase.key}:</span>
          <span className="font-bold">"{phrase.value}"</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            className="ml-1 rounded-full hover:bg-foreground/10 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onToggleDisable(index)}>
          <EyeOffIcon className="mr-2 h-4 w-4" />
          {phrase.isDisabled ? "Enable filter" : "Disable filter"}
        </ContextMenuItem>

        <ContextMenuItem onClick={() => copyValue(phrase.value)}>
          <CopyIcon className="mr-2 h-4 w-4" />
          Copy value
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem variant="destructive" onClick={() => onRemove(index)}>
          <TrashIcon className="mr-2 h-4 w-4" />
          Remove filter
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};