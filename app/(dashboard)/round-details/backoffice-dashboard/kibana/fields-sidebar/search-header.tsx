import { Search, X, Check, Copy, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";
import { LOG_VIEWS } from "./types";

export interface SearchHeaderProps {
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
  search: string;
  setSearch: (val: string) => void;
  isCopied: boolean;
  copyAsTable: () => void;
  currentDataLength: number;
  onUpdateFields: (fields: string[]) => void;
  isCollapsed?: boolean;
}

export function SearchHeader({
  isSearching, setIsSearching, search, setSearch,
  isCopied, copyAsTable, currentDataLength, onUpdateFields,
  isCollapsed
}: SearchHeaderProps) {
  
  const closeSearch = () => {
    setIsSearching(false);
    setSearch("");
  };

  if (isSearching && !isCollapsed) {
    return (
      <div className="relative w-full flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            autoFocus
            placeholder="Search fields..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 pl-7 text-[11px] bg-background focus-visible:ring-1"
            onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
          />
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={closeSearch}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-1 animate-in fade-in duration-200",
      isCollapsed ? "flex-col px-0" : "flex-row"
    )}>
      {currentDataLength > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={isCollapsed ? "icon" : "sm"}
              className={cn("h-7 gap-1", isCollapsed ? "w-7" : "px-2 flex-1")}
              onClick={copyAsTable}
            >
              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isCollapsed ? "right" : "top"}>
            <p className="text-xs">Copy Current Table</p>
          </TooltipContent>
        </Tooltip>
      )}

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-7 w-7 shrink-0">
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side={isCollapsed ? "right" : "top"}>
            <p className="text-xs">Log Views</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent 
          align={isCollapsed ? "start" : "end"} 
          side={isCollapsed ? "right" : "bottom"} 
          className="w-48"
        >
          <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-bold">
            Predefined Views
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {Object.entries(LOG_VIEWS).map(([name, fields]) => (
            <DropdownMenuItem 
              key={name} 
              className="text-[11px] cursor-pointer" 
              onClick={() => onUpdateFields(fields)}
            >
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {!isCollapsed && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 shrink-0" 
              onClick={() => setIsSearching(true)}
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p className="text-xs">Search Fields</p></TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}