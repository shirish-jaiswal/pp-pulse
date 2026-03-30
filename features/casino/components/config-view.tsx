import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { CasinoConfig } from "@/features/casino/types/config";

export function ConfigView({ data }: { data: CasinoConfig }) {
  const configSource = data || {};
  const configs = Object.entries(configSource);

  const renderValue = (val: any) => {
    const stringVal = String(val);

    if (stringVal === 'true') {
      return <Badge variant="outline" className="bg-green-50 text-green-900 border-green-200 font-medium">True</Badge>;
    }
    if (stringVal === 'false') {
      return <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 font-medium">False</Badge>;
    }

    if (!stringVal || stringVal === 'null') {
      return <span className="text-slate-400 italic text-[11px]">not set</span>;
    }

    if (stringVal.includes(',')) {
      return (
        <div className="flex flex-wrap gap-1.5 max-w-lg">
          {stringVal.split(',').map((item, i) => (
            <span key={i} className="bg-slate-50 px-2 py-1 rounded text-[11px] font-mono border border-slate-200 text-slate-700">
              {item}
            </span>
          ))}
        </div>
      );
    }

    return <span className="text-slate-800 break-all">{stringVal}</span>;
  };

  return (
    <Card className="border-none shadow-sm ring-1 ring-border overflow-hidden p-0 gap-0">
      <CardHeader className="bg-slate-50/50 p-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Settings className="h-4 w-4 text-slate-500" /> 
          Technical Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-2/3 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[35%] text-[10px] uppercase font-bold tracking-wider py-3 text-slate-600">
                  Parameter Key
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-wider py-3 text-slate-600">
                  Current Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.length > 0 ? (
                configs.map(([key, value]) => (
                  <TableRow key={key} className="group hover:bg-slate-50/30">
                    <TableCell className="font-mono text-[12px] text-slate-950 font-semibold align-top py-3.5">
                      {key}
                    </TableCell>
                    <TableCell className="font-mono text-[12px] py-3.5">
                      {renderValue(value)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-16 text-slate-500 text-sm">
                    No configuration data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}