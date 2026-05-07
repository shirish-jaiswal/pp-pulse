import { Search, Terminal, Sparkles } from "lucide-react";

export function KibanaEmptyState() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden bg-dot-slate-200 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
      
      <div className="relative flex flex-col items-center max-w-[320px] text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-background shadow-2xl">
            <Search className="h-10 w-10 text-primary" />
            <div className="absolute -top-2 -right-2">
               <Sparkles className="h-5 w-5 text-yellow-500 animate-bounce" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Ready to Query
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your logs are waiting. Adjust the filters above to explore your data and discover insights.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-[11px] font-medium text-muted-foreground">
          <Terminal className="h-3 w-3" />
          <span>Enter <kbd className="font-sans font-bold">Query</kbd> to search</span>
        </div>
      </div>
    </div>
  );
}