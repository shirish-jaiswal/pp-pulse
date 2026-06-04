"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, ChevronDown, Check, Search, X } from "lucide-react";

type CountryZone = {
  country: string;
  code: string;
  timezone: string; // This will hold a clean IANA timezone name (e.g., 'Europe/Bucharest')
};

// Map common countries to their primary native IANA timezones to perfectly preserve DST rules.
const ianaFallbackMap: Record<string, string> = {
  romania: "Europe/Bucharest",
  india: "Asia/Kolkata",
  "united states": "America/New_York",
  "united kingdom": "Europe/London",
  france: "Europe/Paris",
  germany: "Europe/Paris",
  australia: "Australia/Sydney",
  canada: "America/Toronto",
  japan: "Asia/Tokyo",
  china: "Asia/Shanghai",
  brazil: "America/Sao_Paulo",
};

export default function TimeZone() {
  const [countries, setCountries] = useState<CountryZone[]>([]);
  const [selected, setSelected] = useState<CountryZone | null>(null);
  const [times, setTimes] = useState({ local: "--:--:--", utc: "--:--:--" });
  const [offsetStr, setOffsetStr] = useState("UTC+0");
  const [diffStr, setDiffStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,timezones");
        const data = await res.json();

        const formatted: CountryZone[] = data
          .map((item: any) => {
            const countryName = item.name.common;
            const lowerName = countryName.toLowerCase();
            
            // 1. Check our DST override map first.
            // 2. If missing, look for a valid standard IANA string in their timezone list.
            // 3. Fall back to generic UTC.
            let chosenTz = ianaFallbackMap[lowerName];
            
            if (!chosenTz) {
              const standardIana = item.timezones?.find((tz: string) => tz.includes("/"));
              chosenTz = standardIana || "UTC";
            }

            return {
              country: countryName,
              code: item.cca2 ? item.cca2.toLowerCase() : "un",
              timezone: chosenTz,
            };
          })
          .sort((a: CountryZone, b: CountryZone) => a.country.localeCompare(b.country));

        setCountries(formatted);
        const romaniaFallback = formatted.find((c) => c.country === "Romania") || formatted[0];
        setSelected(romaniaFallback);
        setLoading(false);
      } catch (err) {
        console.error("Failed fetching timezone data:", err);
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selected) return;

    const updateClocks = () => {
      const now = new Date();
      
      try {
        const formatOptions: Intl.DateTimeFormatOptions = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };

        // Format dynamic clocks cleanly via native Intl engines
        const localStr = now.toLocaleTimeString("en-US", { ...formatOptions, timeZone: selected.timezone });
        const utcStr = now.toLocaleTimeString("en-US", { ...formatOptions, timeZone: "UTC" });

        setTimes({ local: localStr, utc: utcStr });

        // Calculate dynamic real-time offset strings matching live DST alterations
        const tzPart = new Intl.DateTimeFormat("en-US", {
          timeZone: selected.timezone,
          timeZoneName: "shortOffset",
        }).formatToParts(now).find((p) => p.type === "timeZoneName")?.value || "GMT";
        
        const cleanOffset = tzPart.replace("GMT", "UTC");
        setOffsetStr(cleanOffset === "UTC" ? "UTC+0" : cleanOffset);

        // Get exact dynamic hour variances (+3h, +5.5h, etc.)
        const match = tzPart.match(/GMT([+-])(\d+)?(?::(\d+))?/);
        if (match) {
          const [_, sign, hours, minutes] = match;
          let diffHours = parseInt(hours, 10) + (minutes ? parseInt(minutes, 10) / 60 : 0);
          setDiffStr(`${sign === "+" ? "+" : "-"}${diffHours}h`);
        } else {
          setDiffStr("±0h");
        }

      } catch (e) {
        console.error("Runtime timezone evaluation error: ", e);
      }
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [selected]);

  const filteredCountries = countries.filter((c) =>
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center gap-2 h-8 px-3 border border-border/40 rounded-lg bg-muted/20 text-xs text-muted-foreground animate-pulse">
        <Clock className="w-3.5 h-3.5 animate-spin text-primary" />
        <span className="font-medium">Syncing...</span>
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col" ref={dropdownRef}>
      {/* Container Bar */}
      <div className="flex items-center gap-1.5 bg-muted/40 hover:bg-muted/60 border border-border/80 h-8 p-1 rounded-lg transition-all duration-200 shadow-sm backdrop-blur-sm">
        
        {/* Toggle Anchor Container */}
        <div className="relative h-full flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 bg-background border border-border/50 rounded-md px-2 h-full hover:bg-muted/30 transition-colors focus:outline-none max-w-[150px]"
          >
            {selected && (
              <img 
                src={`https://flagcdn.com/w40/${selected.code}.png`}
                srcSet={`https://flagcdn.com/w80/${selected.code}.png 2x`}
                alt=""
                className="w-4 h-auto object-cover rounded-[1px] shadow-sm shrink-0 select-none"
              />
            )}
            <span className="text-[11px] font-semibold text-foreground/90 truncate tracking-wide">
              {selected?.country}
            </span>
            <ChevronDown className={`w-3 h-3 text-muted-foreground/60 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Fixed Dropdown Portal Placement */}
          {isOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-56 bg-popover border border-border/80 rounded-xl shadow-xl z-50 flex flex-col overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150">
              
              <div className="p-1.5 border-b border-border/60 bg-muted/20 flex items-center gap-1.5 shrink-0">
                <Search className="w-3.5 h-3.5 text-muted-foreground/70 ml-1.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground placeholder-muted-foreground/70 outline-none border-none py-1 h-6 focus:ring-0"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="p-0.5 rounded-md hover:bg-muted text-muted-foreground/60 hover:text-foreground mr-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="max-h-52 overflow-y-auto p-1 dynamic-scrollbar">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <button
                      key={c.country}
                      onClick={() => {
                        setSelected(c);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors text-left ${
                        selected?.country === c.country
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-popover-foreground hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img 
                          src={`https://flagcdn.com/w40/${c.code}.png`}
                          srcSet={`https://flagcdn.com/w80/${c.code}.png 2x`}
                          alt=""
                          className="w-4 h-auto object-cover rounded-[1px] shadow-sm shrink-0 select-none"
                        />
                        <span className="truncate">{c.country}</span>
                      </div>
                      {selected?.country === c.country && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-muted-foreground font-medium italic">
                    No regions found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Time Stats Display Area */}
        <div className="flex items-center gap-2 px-1.5 text-base tracking-tight select-none font-mono">
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground font-bold tabular-nums">
              {times.local}
            </span>
            <span className="text-[11px] text-primary font-sans font-extrabold uppercase bg-primary/5 px-1 rounded-sm tracking-normal">
              {offsetStr}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-bold bg-emerald-50 dark:bg-emerald-950/50 px-1 rounded-sm border border-emerald-200/30 tracking-normal">
              {diffStr}
            </span>
          </div>

          <div className="w-[1px] h-3 bg-border/80 self-center" />

          <div className="flex items-baseline gap-1">
            <span className="text-muted-foreground/80 font-medium tabular-nums">
              {times.utc}
            </span>
            <span className="text-[9px] text-muted-foreground/60 font-sans font-bold uppercase bg-muted px-1 rounded-sm tracking-normal">
              UTC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}