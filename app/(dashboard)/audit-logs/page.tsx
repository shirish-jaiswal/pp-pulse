"use client";

import { useEffect, useState } from "react";
import { c_getAuditLogs } from "@/lib/api/audit-logs/audit-logs";

const PAGE_SIZE = 10;

function parseDevice(userAgent?: string) {
  if (!userAgent) return "Unknown";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Postman")) return "Postman";
  if (userAgent.includes("Windows")) return "Windows";
  return "Other";
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    c_getAuditLogs().then((data) =>
      setLogs(Array.isArray(data) ? data : [])
    );
  }, []);

  const filtered = logs.filter((log) =>
    `${log.actorEmail} ${log.action} ${log.entityValue}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="px-6 py-4 bg-gray-50 min-h-screen">

      {/* ✅ HEADER */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Audit Logs</h1>
        <p className="text-sm text-gray-500">
          Monitor system activity and user actions
        </p>
      </div>

      {/* ✅ SEARCH */}
      <div className="mb-4">
        <input
          placeholder="Search logs..."
          className="border px-3 py-2 rounded-md w-full text-sm focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ✅ TABLE */}
      <div className="bg-white border rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Entity</th>
              <th className="px-4 py-2 text-left">Value</th> {/* ✅ */}
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">IP</th> {/* ✅ */}
              <th className="px-4 py-2 text-left">Device</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((log, i) => (
              <tr
                key={i}
                onClick={() => setSelectedLog(log)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>

                <td className="px-4 py-2">{log.actorEmail}</td>

                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                    {log.action}
                  </span>
                </td>

                <td className="px-4 py-2 text-gray-600">
                  {log.entityType}
                </td>

                {/* ✅ ✅ SMART VALUE (COPY + HIGHLIGHT) */}
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">

                    {log.entityValue?.split("|").map((part: string, idx: number) => (
                      <span
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(part);
                          alert("Copied: " + part);
                        }}
                        title="Click to copy"
                        className={`cursor-pointer text-xs px-2 py-1 rounded border transition
                          ${
                            idx === 0
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : "bg-gray-100 border-gray-200 text-gray-700"
                          }
                          hover:shadow`}
                      >
                        {part}
                      </span>
                    ))}

                  </div>
                </td>

                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      log.status === "SUCCESS"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>

                <td className="px-4 py-2 text-gray-500">
                  {log.sourceIp}
                </td>

                <td className="px-4 py-2 text-gray-500">
                  {parseDevice(log?.metadata?.userAgent)}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ PAGINATION */}
        <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-500 border-t">
          <span>Page {page} / {totalPages}</span>

          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(p-1,1))}>
              Prev
            </button>
            <button onClick={() => setPage(p => Math.min(p+1,totalPages))}>
              Next
            </button>
          </div>
        </div>

      </div>

      {/* ✅ MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white w-[650px] rounded-lg shadow-lg p-5 relative">

            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-3 right-3 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-md font-semibold mb-4">
              Audit Details
            </h2>

            <div className="grid grid-cols-2 gap-3 text-sm">

              <div><b>User:</b> {selectedLog.actorEmail}</div>
              <div><b>Action:</b> {selectedLog.action}</div>
              <div><b>Entity:</b> {selectedLog.entityType}</div>
              <div><b>Status:</b> {selectedLog.status}</div>
              <div><b>IP:</b> {selectedLog.sourceIp}</div>

            </div>

            <div className="mt-4">
              <b>Value:</b>
              <div className="text-gray-600 text-xs break-words bg-gray-50 p-2 rounded">
                {selectedLog.entityValue}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
