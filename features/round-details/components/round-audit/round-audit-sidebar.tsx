"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export function RoundAuditSidebar({
  tabs,
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  return (
    <motion.div
      animate={{ width: isCollapsed ? 64 : 164 }}
      className="bg-muted/20 border-r border-border/50 flex flex-col transition-all duration-200"
    >
      <div className="px-3 py-2 border-b border-border/50 flex items-center justify-between min-h-11 bg-card-foreground/10">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-base font-medium"
          >
            Audit
          </motion.span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center rounded-md text-sm transition-colors",
                    "h-9",
                    isCollapsed ? "justify-center" : "px-3",
                    isActive
                      ? "bg-accent border text-foreground"
                      : "text-muted-foreground hover:bg-accent/60"
                  )}
                >
                  <Icon
                    size={16}
                    className={cn("shrink-0", !isCollapsed && "mr-2")}
                  />

                  {!isCollapsed && (
                    <span className="truncate font-normal">
                      {tab.label}
                    </span>
                  )}
                </button>
              </TooltipTrigger>

              {isCollapsed && (
                <TooltipContent side="right">
                  {tab.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>
    </motion.div>
  );
}