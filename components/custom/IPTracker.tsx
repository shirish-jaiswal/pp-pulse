"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Globe, ChevronDown, Network, Target, MapPin, Compass, Copy, Check } from "lucide-react";
import { s_fetchIpLocation, type IpLocationData } from "@/lib/api/external/s_fetchIpLocation";

export default function IPTracker() {
  const [location, setLocation] = useState<IpLocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [ipQuery, setIpQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofocus the input field when dropdown elements expand
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      setErrorMessage("");
    }
  }, [isOpen]);

  // Initial lookup execution: Fetches the active visitor's details on mount
  useEffect(() => {
    async function loadInitialLocation() {
      const result = await s_fetchIpLocation();
      if (result.success && result.data) {
        setLocation(result.data);
      } else {
        console.error("Failed parsing initial device context location tracking:", result.error);
      }
      setLoading(false);
    }
    loadInitialLocation();
  }, []);

  // Clipboard copy handler function
  const handleCopyDetails = async () => {
    if (!location) return;

    const textToCopy = `IP Address: ${location.ipAddress}\nLocation: ${location.cityName}, ${location.countryName} (${location.countryCode.toUpperCase()})\nCoordinates: ${location.latitude}, ${location.longitude}\nTimezone: ${location.timezone}\nISP: ${location.asnOrganization}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy network details: ", err);
    }
  };

  // Search logic executed when submitting a specific IP string inside the menu
  const handleIpSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipQuery.trim()) return;

    setSearching(true);
    setErrorMessage("");

    const result = await s_fetchIpLocation(ipQuery);

    if (result.success && result.data) {
      setLocation(result.data);
      setIpQuery(""); // Clear search bar upon successful resolution
      setIsOpen(false); // Close dropdown menu selection frame
    } else {
      setErrorMessage(result.error || "Failed to search IP address.");
    }
    setSearching(false);
  };

  // Re-run standard lookup hook mapping back to current user connection info
  const handleResetToMyIp = async () => {
    setSearching(true);
    setErrorMessage("");
    const result = await s_fetchIpLocation();
    if (result.success && result.data) {
      setLocation(result.data);
      setIsOpen(false);
    } else {
      setErrorMessage("Could not re-fetch local client host address.");
    }
    setSearching(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 h-8 px-3 border border-border/40 rounded-lg bg-muted/20 text-xs text-muted-foreground animate-pulse">
        <Network className="w-3.5 h-3.5 animate-spin text-primary" />
        <span className="font-medium">Locating Network Node...</span>
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col" ref={dropdownRef}>
      <div className="flex items-center gap-1.5 bg-muted/40 hover:bg-muted/60 border border-border/80 h-8 p-1 rounded-lg transition-all duration-200 shadow-sm backdrop-blur-sm">
        
        {/* Dropdown Left side trigger: Displays Active target IP Address info */}
        <div className="relative h-full flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 bg-background border border-border/50 rounded-md px-2 h-full hover:bg-muted/30 transition-colors focus:outline-none min-w-[140px] max-w-[210px]"
          >
            {location && (
              <img
                src={`https://flagcdn.com/w40/${location.countryCode}.png`}
                srcSet={`https://flagcdn.com/w80/${location.countryCode}.png 2x`}
                alt=""
                className="w-4 h-auto object-cover rounded-[1px] shadow-sm shrink-0 select-none"
              />
            )}
            <span className="text-[11px] font-mono font-bold text-foreground/90 truncate tracking-tight">
              {location?.ipAddress}
            </span>
            <ChevronDown className={`w-3 h-3 text-muted-foreground/60 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Expanded Dropdown Panel matching identical styles */}
          {isOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-64 bg-popover border border-border/80 rounded-xl shadow-xl z-50 flex flex-col overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150">
              
              {/* Custom Target Lookup Search Input Bar */}
              <form onSubmit={handleIpSearch} className="p-1.5 border-b border-border/60 bg-muted/20 flex items-center gap-1.5 shrink-0">
                <Search className="w-3.5 h-3.5 text-muted-foreground/70 ml-1.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Enter IPv4 or IPv6 Address..."
                  value={ipQuery}
                  onChange={(e) => setIpQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono text-foreground placeholder-muted-foreground/70 outline-none border-none py-1 h-6 focus:ring-0 disabled:opacity-50"
                  disabled={searching}
                />
                <button
                  type="submit"
                  disabled={searching || !ipQuery.trim()}
                  className="text-[10px] font-sans font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
                >
                  {searching ? "..." : "Go"}
                </button>
              </form>

              {/* Sub content option configurations panel */}
              <div className="p-1.5 flex flex-col gap-1">
                {errorMessage && (
                  <div className="text-[10px] text-destructive bg-destructive/10 px-2 py-1 rounded-md font-medium mb-1">
                    {errorMessage}
                  </div>
                )}

                {/* Reset shortcuts targeting home user coordinates */}
                <button
                  type="button"
                  onClick={handleResetToMyIp}
                  disabled={searching}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-popover-foreground hover:bg-muted/60 rounded-md transition-colors text-left font-medium"
                >
                  <Target className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">Detect My Current IP</span>
                </button>

                <div className="h-[1px] bg-border/40 my-0.5" />

                {/* Quick Info Field Summary Metrics list inside dropdown wrapper layout */}
                {location && (
                  <div className="p-1.5 text-[11px] space-y-2 text-muted-foreground bg-muted/20 rounded-md">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                      <span className="truncate">
                        Location: <strong className="text-foreground font-sans">{location.cityName}, {location.countryName}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                      <span className="truncate font-mono text-[10px]">
                        Coords: <span className="text-foreground">{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                      <span className="truncate">
                        ISP: <span className="text-foreground" title={location.asnOrganization}>{location.asnOrganization}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Right Metric readout section displaying current target region values */}
        <div className="flex items-center gap-2 pl-1.5 pr-0.5 text-xs tracking-tight select-none h-full">
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground font-semibold">
              {location?.cityName || "Unknown Local"}
            </span>
            <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded-sm uppercase font-medium tracking-normal">
              {location?.countryCode.toUpperCase()}
            </span>
            <span className="text-[10px] text-primary font-mono font-bold bg-primary/5 border border-primary/10 px-1 rounded-sm tracking-normal">
              {location?.timezone || "UTC"}
            </span>
          </div>

          <div className="w-[1px] h-3 bg-border/80 mx-0.5 self-center" />

          {/* Actionable Copy Button */}
          <button
            type="button"
            onClick={handleCopyDetails}
            title="Copy Network Data String"
            className="p-1 rounded-md hover:bg-background border border-transparent hover:border-border/60 text-muted-foreground/70 hover:text-foreground transition-all focus:outline-none"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-500 animate-in fade-in zoom-in-75 duration-150" />
            ) : (
              <Copy className="w-3 h-3 transition-transform active:scale-95" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}