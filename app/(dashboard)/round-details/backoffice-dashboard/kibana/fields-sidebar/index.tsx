"use client";

import { useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Columns, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/utils/cn";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { FieldSidebarProps } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/fields-sidebar/types";
import { generateTableData } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/fields-sidebar/utils";
import { FieldItem } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/fields-sidebar/field-item";
import { SearchHeader } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/fields-sidebar/search-header";
import { useClickOutside } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/fields-sidebar/use-click-outside";

export function FieldSidebar({
  availableFields, 
  selectedFields, 
  onUpdateFields, 
  onClearAll, 
  currentData
}: FieldSidebarProps) {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSelectedOpen, setIsSelectedOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // 1. Create a ref for the entire sidebar container
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 2. Only close search if clicking ENTIRELY outside the sidebar
  useClickOutside(
    sidebarRef as React.RefObject<HTMLElement>, 
    () => { 
      if (isSearching) {
        setIsSearching(false); 
        setSearch(""); 
      }
    }, 
    isSearching
  );

  const copyAsTable = async () => {
    if (!currentData.length) return;
    const { textTable, htmlTable } = generateTableData(selectedFields, currentData);
    try {
      const item = new ClipboardItem({
        "text/plain": new Blob([textTable], { type: "text/plain" }),
        "text/html": new Blob([htmlTable], { type: "text/html" }),
      });
      await navigator.clipboard.write([item]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) { console.error(err); }
  };

  const filteredAvailable = useMemo(() => 
    availableFields.filter(f => !selectedFields.includes(f) && f.toLowerCase().includes(search.toLowerCase())),
    [availableFields, selectedFields, search]
  );

  const activeFields = useMemo(() => 
    selectedFields.filter(f => f.toLowerCase().includes(search.toLowerCase())),
    [selectedFields, search]
  );

  const headerProps = {
    isSearching,
    setIsSearching,
    search,
    setSearch,
    isCopied,
    copyAsTable,
    currentDataLength: currentData.length,
    onUpdateFields,
  };

  return (
    <TooltipProvider delayDuration={400}>
      {/* 3. Attach ref here so clicks on FieldItems are considered "Inside" */}
      <div 
        ref={sidebarRef}
        className={cn(
          "border-r bg-muted/10 flex flex-col h-full min-h-0 overflow-hidden shrink-0 transition-all duration-300",
          isCollapsed ? "w-12" : "w-64"
        )}
      >
        <div className="p-1.5 border-b bg-muted/30 shrink-0">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Columns className="h-3.5 w-3.5" /> Fields
              </h3>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-6 w-6", isCollapsed && "mx-auto")} 
                  onClick={() => {
                    setIsCollapsed(!isCollapsed);
                    setIsSearching(false);
                  }}
                >
                  {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">{isCollapsed ? "Expand" : "Collapse"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {!isCollapsed && (
            <div className="h-8 flex items-center">
              <SearchHeader {...headerProps} isCollapsed={false} />
            </div>
          )}
        </div>

        {!isCollapsed ? (
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-2 space-y-4 pb-10">
              <section>
                <div className="flex items-center justify-between pr-1 mb-1">
                  <button 
                    onClick={() => setIsSelectedOpen(!isSelectedOpen)} 
                    className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground"
                  >
                    {isSelectedOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    Selected ({selectedFields.length})
                  </button>
                  {selectedFields.length > 2 && isSelectedOpen && (
                    <button 
                      onClick={onClearAll} 
                      className="text-[9px] text-muted-foreground hover:text-destructive"
                    >
                      Deselect All
                    </button>
                  )}
                </div>
                {isSelectedOpen && activeFields.map(f => (
                  <FieldItem 
                    key={f} 
                    field={f} 
                    isSelected 
                    onToggle={() => onUpdateFields(selectedFields.filter(sf => sf !== f))} 
                  />
                ))}
              </section>

              <section>
                <div className="px-1 py-1 text-[10px] font-bold uppercase text-muted-foreground mb-1">Available</div>
                {filteredAvailable.map(f => (
                  <FieldItem 
                    key={f} 
                    field={f} 
                    onToggle={() => onUpdateFields([...selectedFields, f])} 
                  />
                ))}
              </section>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center py-3 gap-4">
            <SearchHeader {...headerProps} isCollapsed={true} />
            
            <div className="h-px w-6 bg-border mx-auto my-1" />
            
            <Columns className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            <div className="text-[9px] font-bold text-muted-foreground/60 [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest whitespace-nowrap">
              Fields Explorer
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}