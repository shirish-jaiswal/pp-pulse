export function LogFooter({ filteredLogs, visibleColumns }: any) {
  return (
    <footer className="h-7 border-t border-border flex items-center justify-between px-3 text-[11px] bg-muted/60">
      <div className="flex gap-3 text-muted-foreground">
        <span className="text-foreground font-medium">Connected</span>
        <span>Rows: {filteredLogs.length}</span>
        <span>Fields: {visibleColumns.length}</span>
      </div>

      <div className="text-muted-foreground">
        {new Date().toISOString()}
      </div>
    </footer>
  );
}