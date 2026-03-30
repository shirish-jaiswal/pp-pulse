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

export function RoundAuditSidebar({ tabs, activeTab, setActiveTab, isCollapsed, setIsCollapsed }: SidebarProps) {
  return (
    <motion.div
      animate={{ width: isCollapsed ? 64 : 164 }}
      className="bg-muted/10 border-r flex flex-col relative transition-all duration-300 ease-in-out"
    >
      <div className="px-4 py-2 border-b flex items-center justify-between overflow-hidden min-h-12">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold uppercase tracking-widest text-primary truncate"
          >
            Audit
          </motion.span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto shrink-0 h-6 w-6"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <nav className="flex-1 px-1 py-2 flex flex-col gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size={isCollapsed ? "icon" : "sm"}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full justify-start transition-all",
                    isCollapsed ? "justify-center px-0" : "px-3"
                  )}
                >
                  <Icon size={18} className={cn("shrink-0", !isCollapsed && "mr-2")} />
                  {!isCollapsed && <span className="text-sm font-medium truncate">{tab.label}</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{tab.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>
    </motion.div>
  );
}