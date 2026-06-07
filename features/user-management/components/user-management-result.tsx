"use client";

import React, { useState, useEffect } from "react";
import { UserData } from "@/lib/api/user-management/user-management";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, History, Mail } from "lucide-react";

/* ✅ CASINO TYPE RESOLVER */
function resolveCasinoType(className: string | null): "BT" | "SW" | "Internal" {
  if (!className) return "Internal";
  if (className.includes("impl.rgs.RGS_Impl")) return "BT";
  if (className.includes("impl.rgs.sw.RgsSwServiceImpl")) return "SW";
  return "Internal";
}

/* ✅ DATE ONLY FORMATTER */
const formatDateOnly = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/* ✅ DATA ROW LAYOUT */
function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 py-2 text-sm border-b border-gray-100/80 last:border-0 items-baseline">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="text-foreground font-medium break-all selection:bg-blue-100">
        {value ?? <span className="text-muted-foreground/50">—</span>}
      </span>
    </div>
  );
}

/* ✅ CARD COMPONENT */
function UserResultCard({
  user,
  index,
  activeUserId,
  setActiveUserId,
}: {
  user: UserData;
  index: number;
  activeUserId: string | null;
  setActiveUserId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const expanded = activeUserId === user.userId;
  const casinoType = resolveCasinoType(user.className);
  const chatAllowed = Boolean(user.chatAllowedFlag);

  const validHistory = (user.history || []).filter(
    (h) =>
      typeof h?.comment === "string" &&
      h.comment.trim() !== "" &&
      typeof h?.time === "string" &&
      !isNaN(Date.parse(h.time))
  );

  const latestValid = validHistory.length > 0 ? validHistory[0] : null;

  // ✅ DYNAMIC DATE RANGE ROUTER (FIXED)
  const handleOpenHistory = (e: React.MouseEvent, range: "today" | "yesterday" | "dayBefore") => {
    e.stopPropagation(); // Prevents accordion toggle
    
    const now = new Date();
    let fromDate = new Date();
    let toDate = new Date();

    const getUtcMidnight = (daysAgo: number) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - daysAgo);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    };

    if (range === "today") {
      fromDate = getUtcMidnight(0);
      toDate = now; 
    } else if (range === "yesterday") {
      fromDate = getUtcMidnight(1);
      toDate = getUtcMidnight(0); 
    } else if (range === "dayBefore") {
      fromDate = getUtcMidnight(2);
      toDate = getUtcMidnight(1); 
    }

    const url = `/portal/player-history?playerId=${user.userId}&from=${fromDate.toISOString()}&to=${toDate.toISOString()}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-card text-card-foreground shadow-sm hover:border-gray-300 transition-colors overflow-hidden">
      
      {/* ✅ HEADER SECTION */}
      <div
        onClick={() => setActiveUserId((prev) => (prev === user.userId ? null : user.userId))}
        className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="w-6 h-6 flex shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground text-xs font-semibold">
            {index + 1}
          </span>

          <div className="flex flex-col gap-1 min-w-0">
            {/* Primary Identity Segment */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <p className="text-sm font-semibold text-foreground tracking-tight">
                User ID: <span className="font-bold">{user.userId}</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
                <span>Casino Name: <span className="font-medium text-foreground">{user.casinoName}</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
                <span>Casino ID: <span className="font-medium text-foreground">{user.casinoId}</span></span>
              </div>
            </div>

            {/* Secondary History Context Segment */}
            {latestValid && (
              <p className="text-xs text-muted-foreground truncate max-w-[240px] sm:max-w-md lg:max-w-xl">
                <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100/70 mr-1.5">
                  Latest ({formatDateOnly(latestValid.time)}):
                </span>
                <span className="text-gray-600">{latestValid.comment}</span>
              </p>
            )}
          </div>
        </div>

        {/* ✅ ACTION CONTROL CONTAINER TRAY */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <Badge variant="secondary" className="font-mono uppercase tracking-wider text-[10px] py-1 h-7 flex items-center">
            {casinoType}
          </Badge>

          {/* Segmented Timeline History Pill Group */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-2xs">
            <div className="px-2 py-1 text-[11px] text-gray-400 font-bold border-r border-gray-100 flex items-center gap-1">
              <History className="w-3 h-3 text-gray-400 stroke-[2.5]" />
              <span className="hidden md:inline uppercase tracking-wider text-[9px]">Bets</span>
            </div>
            <button
              onClick={(e) => handleOpenHistory(e, "today")}
              className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-black rounded-md transition-colors"
              title="Show bets from today (UTC)"
            >
              Today
            </button>
            <button
              onClick={(e) => handleOpenHistory(e, "yesterday")}
              className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-black border-l border-gray-100 transition-colors"
              title="Show bets from yesterday (UTC)"
            >
              Yesterday
            </button>
            <button
              onClick={(e) => handleOpenHistory(e, "dayBefore")}
              className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-black border-l border-gray-100 rounded-r-md transition-colors"
              title="Show bets from 2 days ago (UTC)"
            >
              2 Days Ago
            </button>
          </div>
          
          <div className="text-muted-foreground pl-1">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* ✅ EXPANDED CONTENT DATA DRAWER */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/30">
          <div className="mt-2 rounded-lg border border-gray-100 bg-white p-3 shadow-inner space-y-0.5">
            <KVRow label="User ID" value={user.userId} />
            <KVRow label="Email" value={user.emailAddress} />
            <KVRow label="Casino ID" value={user.casinoId} />
            <KVRow label="Casino Name" value={user.casinoName} />
            <KVRow
              label="Chat Status"
              value={
                <Badge variant={chatAllowed ? "success" : "destructive"} className="text-xs">
                  {chatAllowed ? "Allowed" : "Blocked"}
                </Badge>
              }
            />
          </div>

          {/* COMMENT LOG MODERATION VIEW */}
          {validHistory.length > 0 && (
            <div className="pt-4 mt-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Comment Log ({validHistory.length})
              </p>
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {validHistory.map((h, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-2.5 bg-white shadow-2xs">
                    <p className="text-sm font-normal text-foreground leading-relaxed">
                      {h.comment}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                      {formatDateOnly(h.time)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ✅ DATA TRANSFORMATION INTERNAL GROUPER */
function groupByEmail(data: UserData[]) {
  return Object.values(
    data.reduce((acc: any, user: UserData) => {
      const email = user.emailAddress || "No Email";
      if (!acc[email]) {
        acc[email] = { email, users: [] };
      }
      acc[email].users.push(user);
      return acc;
    }, {})
  );
}

/* ✅ LIST ARCHITECTURE (GROUPED BY EMAIL) */
export function UserManagementResult({ data }: { data: UserData[] }) {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length === 1) {
      setActiveUserId(data[0].userId);
    } else {
      setActiveUserId(null);
    }
  }, [data]);

  if (!data?.length) return <div className="text-center py-6 text-sm text-muted-foreground">No matching data records found.</div>;

  const grouped = groupByEmail(data);

  return (
    <div className="space-y-6">
      {grouped.map((group: any, i: number) => (
        <div key={i} className="space-y-2.5">
          <div className="flex items-center gap-2 px-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{group.email}</span>
            <span className="lowercase text-muted-foreground/60 font-normal">({group.users.length} associated accounts)</span>
          </div>

          <div className="space-y-2.5">
            {group.users.map((user: UserData, index: number) => (
              <UserResultCard
                key={user.userId || index}
                user={user}
                index={index}
                activeUserId={activeUserId}
                setActiveUserId={setActiveUserId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ✅ FLAT RESULT VIEW ARCHITECTURE */
export function UserManagementResultById({ data }: { data: UserData[] }) {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length === 1) {
      setActiveUserId(data[0].userId);
    } else {
      setActiveUserId(null);
    }
  }, [data]);

  if (!data?.length) return <div className="text-center py-6 text-sm text-muted-foreground">No matching data records found.</div>;

  return (
    <div className="space-y-2.5">
      {data.map((user, i) => (
        <UserResultCard
          key={user.userId || i}
          user={user}
          index={i}
          activeUserId={activeUserId}
          setActiveUserId={setActiveUserId}
        />
      ))}
    </div>
  );
}