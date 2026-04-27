"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Database, Search, Server } from "lucide-react";
import { cn } from "@/utils/cn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

import { FieldSidebar } from "../fields-sidebar/index";
import { LogRow } from "./log-row";
import { flattenObject, getServiceName } from "../utils";
import { EsResponse } from "@/types/kibana";

type LogResultsDashboardProps = {
  data: EsResponse;
};

export function LogResultsDashboard(data : LogResultsDashboardProps) {
  const hits = data?.data.logs || [];
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [indexFilter, setIndexFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFields, setSelectedFields] = useState<string[]>(["@timestamp", "message"]);

  const updateFields = (fields: string[]) => {
   setSelectedFields(fields);
  }

  const availableFields = useMemo(() => {
    const fields = new Set<string>();
    hits.forEach((hit: any) => Object.keys(flattenObject(hit._source)).forEach(k => fields.add(k)));
    return Array.from(fields).sort();
  }, [hits]);

  const availableServices = useMemo(() => {
    const services = new Set<string>();
    hits.forEach((hit: any) => services.add(getServiceName(hit._index)));
    return Array.from(services).sort();
  }, [hits]);

  const filteredHits = useMemo(() => {
    return hits.filter((h: any) => {
      const serviceName = getServiceName(h._index);
      const matchesService = indexFilter.length === 0 || indexFilter.includes(serviceName);
      if (!matchesService) return false;
      if (!searchQuery.trim()) return true;
      return JSON.stringify(h._source).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [hits, indexFilter, searchQuery]);

  return (
    <div className="rounded-xl border bg-card w-full h-[80vh] flex flex-col overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Log Explorer</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-2">
                <Server className="h-3.5 w-3.5" />
                Services {indexFilter.length > 0 && `(${indexFilter.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {availableServices.map((service) => (
                <DropdownMenuCheckboxItem
                  key={service}
                  checked={indexFilter.includes(service)}
                  onCheckedChange={() => setIndexFilter(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service])}
                >
                  {service}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-7 w-64 text-[10px] pl-7 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <FieldSidebar
          availableFields={availableFields}
          selectedFields={selectedFields}
          onUpdateFields={updateFields}
          onClearAll={() => setSelectedFields(["@timestamp"])}
          currentData={filteredHits}
        />

        <div className="flex-1 overflow-hidden relative bg-background">
          <ScrollArea className="h-full w-full">
            <Table className="table-fixed w-full border-separate border-spacing-0">
              <TableHeader className="sticky top-0 z-50 bg-muted/95 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-3 border-b" />
                  {selectedFields.map(field => {
                    const isTimeField = field === "@timestamp";
                    return (
                      <TableHead
                        key={field}
                        className={cn(
                          "border-b py-3 font-mono text-[10px] font-bold text-primary uppercase tracking-tighter",
                          isTimeField
                            ? "w-14 min-w-14 max-w-14"
                            : field === "message"
                              ? "w-[80%]"
                              : "w-40"
                        )}
                      >
                        {field}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHits.map((hit: any) => (
                  <LogRow
                    key={hit._id}
                    hit={hit}
                    selectedFields={selectedFields}
                    isExpanded={expandedRowId === hit._id}
                    onToggle={() => setExpandedRowId(expandedRowId === hit._id ? null : hit._id)}
                  />
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}