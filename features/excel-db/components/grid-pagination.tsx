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
  onPageChange,
}: GridPaginationProps) {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-1.5 border-t border-border bg-background">

      {/* LEFT: status */}
      <div className="text-[11px] text-muted-foreground">
        Page{" "}
        <span className="font-semibold text-foreground">{page}</span>
        <span className="mx-1 text-border">/</span>
        <span className="font-semibold text-foreground">{total}</span>

        <span className="mx-2 text-border">•</span>

        <span className="font-medium text-foreground">
          {filteredCount}
        </span>
        <span> rows</span>
      </div>

      {/* RIGHT: controls */}
      <div className="flex items-center gap-1">

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-muted/60 disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="sr-only">Previous</span>
        </Button>

        <div className="min-w-6 text-center text-[11px] font-semibold tabular-nums text-foreground">
          {page}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-muted/60 disabled:opacity-40"
          disabled={page >= total}
          onClick={() => onPageChange(Math.min(total, page + 1))}
        >
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="sr-only">Next</span>
        </Button>

      </div>
    </div>
  );
}