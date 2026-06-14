"use client";

import React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

// Custom Imports from your project
import { DateRangeValue } from "@/features/log-exp/date-time-range-picker/types";
import { IntegratedDateTimeRangePicker } from "@/features/log-exp/date-time-range-picker/components/integrated-date-time-range-picker";

interface UrlGeneratorSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  placeholders: string[];
  placeholderValues: Record<string, string>;
  setPlaceholderValues: (values: Record<string, string>) => void;
  selectedDateRange: DateRangeValue | undefined;
  setSelectedDateRange: (range: DateRangeValue | undefined) => void;
  generatedUrl: string;
  onCompileUrl: () => void;
  onCopyUrl: () => void;
}

export function UrlGeneratorSheet({
  isOpen,
  onOpenChange,
  placeholders,
  placeholderValues,
  setPlaceholderValues,
  selectedDateRange,
  setSelectedDateRange,
  generatedUrl,
  onCompileUrl,
  onCopyUrl,
}: UrlGeneratorSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md min-w-[35vw] overflow-y-auto p-6 flex flex-col h-full text-xs">
        <SheetHeader className="text-left border-b pb-3 mb-4">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider">
            Resolve Query Variables & Timeframe
          </SheetTitle>
          <SheetDescription className="text-xs">
            Provide mandatory timeline limits and replacement strings mapping to active custom parameters.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 py-2">
          {/* MANDATORY TIME RANGE CONTROLLER */}
          <div className="flex flex-col space-y-2 border-b pb-6">
            <label className="font-bold text-foreground text-[11px] uppercase tracking-wide flex items-center gap-1">
              Target Time Window <span className="text-destructive">*</span>
            </label>
            <IntegratedDateTimeRangePicker
              value={selectedDateRange}
              onChange={(range: any) => setSelectedDateRange(range)}
            />
            {!selectedDateRange?.from && (
              <p className="text-[10px] text-destructive italic mt-1">
                * Explicit Selection Required: Link processing is locked until timeframe boundaries are set.
              </p>
            )}
          </div>

          {/* DYNAMIC COMPONENT INPUT VARIABLES */}
          {placeholders.length > 0 && (
            <div className="space-y-4">
              <div className="font-bold text-foreground text-[11px] uppercase tracking-wide">
                Template Value Resolution:
              </div>
              {placeholders.map((key) => (
                <div key={key} className="flex flex-col space-y-1">
                  <label className="font-semibold text-muted-foreground font-mono">
                    {"{"}{key}{"}"} value
                  </label>
                  <Input
                    type="text"
                    value={placeholderValues[key] || ""}
                    onChange={(e) =>
                      setPlaceholderValues({
                        ...placeholderValues,
                        [key]: e.target.value,
                      })
                    }
                    placeholder={`Enter configuration string for ${key}...`}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              ))}
            </div>
          )}

          {/* FINAL TARGET URL BLOCK */}
          {generatedUrl && (
            <div className="mt-6 p-3 bg-muted rounded border space-y-2 break-all relative group">
              <div className="flex items-center justify-between border-b border-border/50 pb-1.5 mb-1.5">
                <div className="font-bold text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" /> 
                  Compiled Kibana Link:
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={onCopyUrl}
                  title="Copy URL to clipboard"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <a 
                href={generatedUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-[11px] block leading-relaxed"
              >
                {generatedUrl}
              </a>
            </div>
          )}
        </div>

        <SheetFooter className="mt-auto pt-4 border-t flex flex-row gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            size="sm" 
            className="flex-1"
            onClick={onCompileUrl}
            disabled={!selectedDateRange?.from}
          >
            Generate URL
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}