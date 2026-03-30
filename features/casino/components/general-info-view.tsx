import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Globe, Landmark, Languages } from "lucide-react";
import { CasinoDetails } from "@/features/casino/types/details";

export function GeneralInfoView({ data }: { data: CasinoDetails }) {
  const info = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2 border-none shadow-sm ring-1 ring-border">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" /> Core Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Description</p>
              <p className="text-sm font-semibold">{info.description || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Hub</p>
              <p className="text-sm font-semibold">{info.hub}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
              <div className="flex gap-2 mt-1">
                <Badge className={info.active ? "bg-emerald-500" : "bg-slate-400"}>
                  {info.active ? "Active" : "Inactive"}
                </Badge>
                {info.live && (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                    Live
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Casino ID</p>
              <p className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded w-fit mt-1">
                {info.casinoId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-border bg-slate-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-[10px] uppercase font-black text-slate-400">Localization & Region</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <Globe className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Country</p>
              <span className="text-xs font-semibold">{info.countryName} ({info.countryCode})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <Landmark className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Currency</p>
              <span className="text-xs font-semibold">{info.currencyCode}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <Languages className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Language</p>
              <span className="text-xs font-semibold uppercase">{info.languageCode}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}