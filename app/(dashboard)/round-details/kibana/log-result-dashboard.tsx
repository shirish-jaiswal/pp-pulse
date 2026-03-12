"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Database,
  Search,
  X,
  Filter,
  Columns,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// --- UTILITIES ---

const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
  return Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

const getDeepValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// --- COMPONENT ---

interface KibanaLogHit {
  _id: string;
  _index: string;
  _source: Record<string, any>;
}

export interface LogDashboardProps {
  data: {
    data: {
      rawResponse?: {
        took: number;
        hits?: {
          hits: KibanaLogHit[];
        };
      };
    };
  };
}

export function LogResultsDashboard({ data }: LogDashboardProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [indexFilter, setIndexFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnSearch, setColumnSearch] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>(["@timestamp"]);

  const hits = data?.data?.rawResponse?.hits?.hits || [];

  // Helper to parse service name from index
  const getServiceName = (index: string) => {
    return index.replace(/^filebeat-/, "").replace(/-\d{4}\.\d{2}\.\d{2}(-\d{6})?$/, "");
  };

  // Extract unique services from data
  const availableServices = useMemo(() => {
    const services = new Set<string>();
    hits.forEach((hit) => {
      services.add(getServiceName(hit._index));
    });
    return Array.from(services).sort();
  }, [hits]);

  const availableFields = useMemo(() => {
    const fields = new Set<string>();
    hits.forEach((hit) => {
      const flattened = flattenObject(hit._source);
      Object.keys(flattened).forEach((k) => fields.add(k));
    });
    return Array.from(fields).sort();
  }, [hits]);

  const filteredAvailableFields = useMemo(() => {
    return availableFields.filter(field =>
      field.toLowerCase().includes(columnSearch.toLowerCase())
    );
  }, [availableFields, columnSearch]);

  const toggleService = (service: string) => {
    setIndexFilter(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const filteredHits = useMemo(() => {
    return hits.filter((h) => {
      // 1. Service Filter
      const serviceName = getServiceName(h._index);
      const matchesService = indexFilter.length === 0 || indexFilter.includes(serviceName);
      if (!matchesService) return false;

      // 2. Search Logic
      if (!searchQuery.trim()) return true;
      const fullText = `${h._source?.message} ${h._index}`.toLowerCase();

      try {
        const tokenRegex = /"([^"]+)"|\b(and|or)\b|([\(\)])|([^\s\(\)]+)/gi;
        let expression = searchQuery.toLowerCase().replace(tokenRegex, (match, phrase, logical, paren, word) => {
          if (phrase) return `fullText.includes("${phrase}")`;
          if (logical === "and") return " && ";
          if (logical === "or") return " || ";
          if (paren) return paren;
          if (word) return `fullText.includes("${word}")`;
          return match;
        });
        const checkLogic = new Function("fullText", `return ${expression};`);
        return checkLogic(fullText);
      } catch (e) {
        return fullText.includes(searchQuery.toLowerCase().replace(/"/g, ""));
      }
    });
  }, [hits, indexFilter, searchQuery]);

  return (
    <div className="rounded-xl border bg-card w-full h-full flex flex-col overflow-hidden shadow-sm">
      {/* ACTION BAR */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Database className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">PP Pulse Explorer</span>
          </div>

          {/* SERVICE FILTER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-2">
                <Server className="h-3.5 w-3.5" />
                Services {indexFilter.length > 0 && `(${indexFilter.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Filter by Service</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className={availableServices.length > 10 ? "h-72" : "h-auto"}>
                {availableServices.map((service) => (
                  <DropdownMenuCheckboxItem
                    key={service}
                    checked={indexFilter.includes(service)}
                    onCheckedChange={() => toggleService(service)}
                    onSelect={(e) => e.preventDefault()}
                    className="text-[11px] font-mono"
                  >
                    {service}
                  </DropdownMenuCheckboxItem>
                ))}
              </ScrollArea>
              {indexFilter.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    className="w-full justify-center h-8 text-[10px] text-destructive"
                    onClick={() => setIndexFilter([])}
                  >
                    Reset Services
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* COLUMN PICKER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-2">
                <Columns className="h-3.5 w-3.5" />
                Columns ({selectedFields.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-0">
              <div className="p-2 border-b bg-muted/30 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] uppercase text-muted-foreground">Fields</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFields([])}
                    className="h-5 px-2 text-[9px] text-destructive hover:bg-destructive/10"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search fields..."
                    value={columnSearch}
                    onChange={(e) => setColumnSearch(e.target.value)}
                    className="h-8 pl-7 text-[11px]"
                  />
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="p-1">
                  {filteredAvailableFields.map((field) => (
                    <DropdownMenuCheckboxItem
                      key={field}
                      checked={selectedFields.includes(field)}
                      onCheckedChange={() =>
                        setSelectedFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field])
                      }
                      onSelect={(e) => e.preventDefault()}
                      className="text-[11px] font-mono py-1.5"
                    >
                      {field}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground font-mono bg-background px-2 py-1 rounded border">
            MATCHED: {filteredHits.length}
          </span>
        </div>
      </div>

      {/* TABLE */}
      <ScrollArea className="flex-1 w-full">
        <Table className="relative w-full border-separate border-spacing-0">
          <TableHeader className="sticky top-0 z-50 shadow-sm">
            <TableRow className="hover:bg-transparent">
              {/* Expansion Toggle Column */}
              <TableHead className="w-[40px] bg-muted/95 border-b" />

              {/* Dynamic Field Columns */}
              {selectedFields.map(field => (
                <TableHead key={field} className="bg-muted/95 border-b min-w-[150px]">
                  <span className="text-[10px] font-bold tracking-tight text-primary uppercase font-mono">
                    {field} {/* Changed from field.split('.').pop() to show full name */}
                  </span>
                </TableHead>
              ))}

              {/* Message Search Column */}
              {
                filteredHits.at(0)?._source.hasOwnProperty("message") && (
                  <TableHead className="bg-muted/95 border-b min-w-[400px]">
                    <div className="flex items-center gap-2">
                      <div className="relative w-full">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Search messages..."
                          className="h-7 text-[10px] pl-7 bg-background/50"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </TableHead>
                )
              }
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHits.map((hit) => {
              const isExpanded = expandedRows.has(hit._id);
              return (
                <React.Fragment key={hit._id}>
                  <TableRow
                    className={cn(isExpanded ? "bg-muted/30" : "hover:bg-muted/50", "cursor-pointer")}
                    onClick={() => {
                      const newSet = new Set(expandedRows);
                      isExpanded ? newSet.delete(hit._id) : newSet.add(hit._id);
                      setExpandedRows(newSet);
                    }}
                  >
                    <TableCell className="p-2 text-center">
                      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </TableCell>
                    {selectedFields.map(field => {
                      const rawValue = getDeepValue(hit._source, field);
                      let displayValue = String(rawValue ?? "-");
                      if (field === "@timestamp" && rawValue) {
                        const date = new Date(rawValue);
                        displayValue = date.toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + `.${date.getMilliseconds().toString().padStart(3, '0')}`;
                      }
                      return (
                        <TableCell key={field} className="py-2">
                          <div className="font-mono text-[12px] whitespace-pre-wrap break-all">
                            {displayValue}
                          </div>
                        </TableCell>
                      );
                    })}
                    {
                      hit._source.message && (
                        <TableCell className="font-mono text-[12px] whitespace-pre-wrap break-all">
                          {hit._source.message}
                        </TableCell>
                      )
                    }
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="bg-muted/10">
                      <TableCell colSpan={selectedFields.length + 2} className="p-4 w-full">
                        <div className="rounded-lg bg-slate-950 p-4 border relative group">
                          <pre className="text-[11px] text-emerald-400 overflow-x-auto font-mono whitespace-pre-wrap break-all">
                            {JSON.stringify(hit._source, null, 2)}
                          </pre>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}