"use client";

import * as React from "react";
import { ListTree } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { INSERT_LOGS_COMMAND } from "@/components/custom/text-editor/toolbar/logs/log-command";
import { truncateLogs } from "@/components/custom/text-editor/toolbar/logs/log-utils";
import { useLogState } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-log-state";

export function LogTogglePlugin() {
  const [editor] = useLexicalComposerContext();

  const {
    availableTabs,
    activeTab,
    setActiveTab,
    filteredLogs,
    visibleColumns,
    isLoading,
  } = useLogState();

  const [open, setOpen] = React.useState(false);

  const hasLogs = filteredLogs?.length > 0;

  const insertLogs = () => {
    if (!hasLogs) return;

    editor.dispatchCommand(INSERT_LOGS_COMMAND, {
      activeTab: activeTab || "logs",
      logs: truncateLogs(filteredLogs, 20),
      columns: visibleColumns,
    });

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <ListTree className="h-4 w-4" />
          Insert Logs
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72" align="start">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Log Type
          </div>

          <div className="flex flex-col gap-2">
            {availableTabs.map((tab) => (
              <Button
                key={tab}
                size="sm"
                variant={tab === activeTab ? "default" : "outline"}
                className="justify-start"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
          {isLoading ? (
            <div className="text-xs text-muted-foreground text-center py-2">
              Loading logs...
            </div>
          ) : hasLogs ? (
            <Button className="w-full" onClick={insertLogs}>
              Insert {filteredLogs.length} Logs
            </Button>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-2">
              No logs available
            </div>
          )}
      </PopoverContent>
    </Popover>
  );
}