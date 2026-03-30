import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GridPaginationProps {
  page: number;
  total: number;
  filteredCount: number;
  onPageChange: (newPage: number) => void;
}

export function GridPagination({ 
  page, 
  total, 
  filteredCount, 
  onPageChange 
}: GridPaginationProps) {
  // Don't render anything if there's only one page or no data
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-background shrink-0">
      <span className="text-xs text-muted-foreground font-medium">
        Page <span className="text-foreground">{page}</span> of {total} 
        <span className="mx-2 text-border">|</span> 
        <span className="text-foreground">{filteredCount}</span> total rows
      </span>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 transition-all active:scale-95"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="sr-only">Previous Page</span>
        </Button>
        
        <div className="flex items-center justify-center min-w-1 text-[11px] font-bold">
          {page}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 transition-all active:scale-95"
          disabled={page >= total}
          onClick={() => onPageChange(Math.min(total, page + 1))}
        >
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  );
}