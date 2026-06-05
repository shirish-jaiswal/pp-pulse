"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, ChevronDown, Check, Search, X } from "lucide-react";
import { s_fetchCountryZones, type CountryZone } from "@/lib/api/external/s_fetchCountryZones";
import { useProfile } from "@/context/use-profile";

interface TimeZoneProps {
  onCountrySelect?: (countryName: string) => void;
  defaultCountryName?: string;
  disabled?: boolean;
}

export default function TimeZone({ onCountrySelect, defaultCountryName, disabled = false }: TimeZoneProps) {
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

  const { user } = useProfile();

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

  // Phase 1: Load countries and match against profile props OR user.default context OR Romania fallback
  useEffect(() => {
    async function fetchCountries() {
      const result = await s_fetchCountryZones();

      if (result.success && result.data.length > 0) {
        setCountries(result.data);

        const targetCountryName = defaultCountryName || (user as any)?.defaultCountry || "Romania";

        const savedCountry = result.data.find(
          (c) => c.country.toLowerCase() === targetCountryName.toLowerCase()
        );

        const initialFallback = savedCountry || result.data.find((c) => c.country === "Romania") || result.data[0];
        setSelected(initialFallback);
      } else {
        console.error("Failed fetching timezone data:", result.error);
      }
      setLoading(false);
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    const activeDefault = defaultCountryName || (user as any)?.defaultCountry || "Romania";

    if (countries.length > 0) {
      const savedCountry = countries.find(
        (c) => c.country.toLowerCase() === activeDefault.toLowerCase()
      );
      if (savedCountry) {
        setSelected(savedCountry);
      }
    }
  }, [defaultCountryName, countries, user]);

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

        const localStr = now.toLocaleTimeString("en-US", { ...formatOptions, timeZone: selected.timezone });
        const utcStr = now.toLocaleTimeString("en-US", { ...formatOptions, timeZone: "UTC" });

        setTimes({ local: localStr, utc: utcStr });

        const tzPart = new Intl.DateTimeFormat("en-US", {
          timeZone: selected.timezone,
          timeZoneName: "shortOffset",
        }).formatToParts(now).find((p) => p.type === "timeZoneName")?.value || "GMT";

        const cleanOffset = tzPart.replace("GMT", "UTC");
        setOffsetStr(cleanOffset === "UTC" ? "UTC+0" : cleanOffset);

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
      <div className="flex items-center gap-1.5 bg-muted/40 hover:bg-muted/60 border border-border/80 h-8 p-1 rounded-lg transition-all duration-200 shadow-sm backdrop-blur-sm">
        <div className="relative h-full flex items-center">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 bg-background border border-border/50 rounded-md px-2 h-full transition-colors focus:outline-none max-w-[150px] ${disabled ? "opacity-90 cursor-not-allowed" : "hover:bg-muted/30"
              }`}
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
            {!disabled && (
              <ChevronDown className={`w-3 h-3 text-muted-foreground/60 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
            )}
          </button>

          {isOpen && !disabled && (
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
                    type="button"
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
                      type="button"
                      key={c.country}
                      onClick={() => {
                        setSelected(c);
                        setIsOpen(false);
                        onCountrySelect?.(c.country);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors text-left ${selected?.country === c.country
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