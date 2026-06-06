"use client";

import React, { useState } from "react";
import { UserData } from "@/lib/api/user-management/user-management";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

/* ✅ HELPER */
function resolveCasinoType(className: string | null): "BT" | "SW" | "Internal" {
  if (!className) return "Internal";
  if (className.includes("impl.rgs.RGS_Impl")) return "BT";
  if (className.includes("impl.rgs.sw.RgsSwServiceImpl")) return "SW";
  return "Internal";
}

/* ✅ KV ROW */
function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-6 py-2 text-sm border-b last:border-0">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold break-words">
        {value ?? <span className="text-muted-foreground">—</span>}
      </span>
    </div>
  );
}

/* ✅ CARD */
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

  /* ✅ VALID HISTORY */
  const validHistory = (user.history || []).filter(
    (h) =>
      typeof h?.comment === "string" &&
      h.comment.trim() !== "" &&
      typeof h?.time === "string" &&
      !isNaN(Date.parse(h.time))
  );

  /* ✅ LATEST = FIRST (API already sorted) */
  const latestValid = validHistory.length > 0 ? validHistory[0] : null;

  return (
    <div className="w-full rounded-lg border bg-white shadow-sm overflow-hidden">

      {/* ✅ HEADER */}
      <div
        onClick={() =>
          setActiveUserId((prev) =>
            prev === user.userId ? null : user.userId
          )
        }
        className="flex justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
      >
        <div className="flex gap-3">

          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            {index + 1}
          </span>

          <div className="flex flex-col gap-1.5">

            <p className="text-base font-semibold text-gray-900">
              <span className="text-gray-500 font-medium">User ID: </span>
              {user.userId}
            </p>

            <p className="text-sm">
              <span className="text-gray-500 font-medium">Casino Name: </span>
              <span className="font-semibold text-gray-800">
                {user.casinoName} ({casinoType})
              </span>
            </p>

            <p className="text-sm">
              <span className="text-gray-500 font-medium">Casino ID: </span>
              <span className="font-medium text-gray-800">
                {user.casinoId}
              </span>
            </p>

            {/* ✅ LATEST */}
            {latestValid && (
              <p className="text-sm mt-1">
                <span className="text-gray-500 font-medium">Latest: </span>
                <span className="font-semibold text-gray-900">
                  {latestValid.comment} (
                  {new Date(latestValid.time).toLocaleString("en-GB", {
  timeZone: "UTC",
})} UTC)

                </span>
              </p>
            )}

          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            {casinoType}
          </Badge>

          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* ✅ EXPANDED */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t">

          <p className="text-base font-semibold mb-3">User Details</p>

          <KVRow label="User ID" value={user.userId} />
          <KVRow label="Email" value={user.emailAddress} />
          <KVRow label="Casino ID" value={user.casinoId} />
          <KVRow label="Casino Name" value={user.casinoName} />

          <KVRow
            label="Chat Allowed"
            value={
              <Badge variant={chatAllowed ? "default" : "outline"}>
                {chatAllowed ? "Allowed" : "Blocked"}
              </Badge>
            }
          />

          {/* ✅ PLAYER HISTORY BUTTON */}
         {/* ✅ ✅ ✅ LAST 24h PLAYER HISTORY BUTTON */}
<div className="pt-3">
  <button
    title="Shows player last 24 hour game history"
    onClick={(e) => {
      e.stopPropagation();

      const now = new Date();
      const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // ✅ IMPORTANT: remove .slice()
      const from = past24h.toISOString();
      const to = now.toISOString();

      const url = `/portal/player-history?playerId=${user.userId}&from=${from}&to=${to}`;

      window.open(url, "_blank");
    }}
    className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
  >
    Player History
  </button>
</div>

          {/* ✅ COMMENT HISTORY */}
          {validHistory.length > 0 && (
            <div className="pt-4">

              <p className="text-sm font-semibold mb-2">
                Comment Notes ({validHistory.length})
              </p>

              {validHistory.map((h, i) => (
                <div
                  key={i}
                  className="border rounded-md p-3 mb-2 bg-gray-50"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {h.comment}
                  </p>

                  

<span className="text-xs text-gray-500">
  {new Date(h.time).toLocaleString("en-GB", {
    timeZone: "UTC",
  })} UTC
</span>


                </div>
              ))}

            </div>
          )}

        </div>
      )}
    </div>
  );
}

/* ✅ GROUP */
function groupByEmail(data: UserData[]) {
  return Object.values(
    data.reduce((acc: any, user: UserData) => {
      const email = user.emailAddress || "No Email";

      if (!acc[email]) {
        acc[email] = {
          email,
          users: [],
        };
      }

      acc[email].users.push(user);
      return acc;
    }, {})
  );
}

/* ✅ LIST */
export function UserManagementResult({ data }: { data: UserData[] }) {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  if (!data?.length) return <p>No data</p>;

  const grouped = groupByEmail(data);

  return (
    <div className="space-y-4">
      {grouped.map((group: any, i: number) => (
        <div key={i}>
          <p className="text-sm text-gray-600 font-medium mb-2">
            Email: {group.email} ({group.users.length} users)
          </p>

          <div className="space-y-3">
            {group.users.map((user: UserData, index: number) => (
              <UserResultCard
                key={index}
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

/* ✅ BY ID */
export function UserManagementResultById({ data }: { data: UserData[] }) {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  if (!data?.length) return <p>No data</p>;

  return (
    <div className="space-y-3">
      {data.map((user, i) => (
        <UserResultCard
          key={i}
          user={user}
          index={i}
          activeUserId={activeUserId}
          setActiveUserId={setActiveUserId}
        />
      ))}
    </div>
  );
}