import { Search, RefreshCw, Download, Plus, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function GridToolbar({ tableName, rowCount, search, onSearchChange, onRefresh, onExport, onInsert }: any) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <Table2 className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="font-semibold text-sm truncate">{tableName}</span>
        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{rowCount} rows</Badge>
      </div>
      <div className="flex-1 flex items-center gap-2 justify-end">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search rows..." 
            value={search} 
            onChange={(e) => onSearchChange(e.target.value)} 
            className="pl-8 h-8 text-sm" 
          />
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onRefresh}><RefreshCw className="h-3.5 w-3.5" /></Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onExport}><Download className="h-3.5 w-3.5" /></Button>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={onInsert}><Plus className="h-3.5 w-3.5" /> Insert Row</Button>
      </div>
    </div>
  );
}