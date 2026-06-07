import { parseDevice } from "../utils/parseDevice";

export default function LogsTable({ logs }: any) {
  return (
    <div className="bg-white border rounded-lg overflow-x-auto">
      <table className="w-full text-sm table-fixed">

        {/* ✅ HEADER */}
        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
          <tr>
            <th className="px-4 py-2 text-left w-[180px]">Time</th>
            <th className="px-4 py-2 text-left w-[220px]">User</th>
            <th className="px-4 py-2 text-left w-[160px]">Action</th>
            <th className="px-4 py-2 text-left w-[140px]">Entity</th>
            <th className="px-4 py-2 text-left w-[280px]">Value</th>
            <th className="px-4 py-2 text-left w-[120px]">Status</th>
            <th className="px-4 py-2 text-left w-[120px]">IP</th>
            <th className="px-4 py-2 text-left w-[120px]">Device</th>
          </tr>
        </thead>

        {/* ✅ BODY */}
        <tbody>
          {logs.map((log: any, i: number) => {
            // ✅ FIX VALUE SPLIT
            const parts = log?.entityValue?.split(" | ");

            return (
              <tr key={i} className="border-t hover:bg-gray-50">

                {/* TIME */}
                <td className="px-4 py-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>

                {/* USER */}
                <td className="px-4 py-2 truncate">
                  {log.actorEmail}
                </td>

                {/* ACTION */}
                <td className="px-4 py-2 truncate">
                  {log.action}
                </td>

                {/* ENTITY */}
                <td className="px-4 py-2 truncate">
                  {log.entityType}
                </td>

                {/* ✅ VALUE (FIXED 🔥) */}
                <td
                  className="px-4 py-2 max-w-[280px]"
                  title={log.entityValue}
                >
                  {parts?.length > 1 ? (
                    <>
                      <div className="font-medium truncate">
                        {parts[0]}
                      </div>

                      <div className="text-xs text-gray-500 truncate">
                        {parts[1]}
                      </div>
                    </>
                  ) : (
                    <div className="truncate">
                      {log.entityValue}
                    </div>
                  )}
                </td>

                {/* STATUS */}
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      log.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>

                {/* IP */}
                <td className="px-4 py-2 truncate">
                  {log.sourceIp}
                </td>

                {/* DEVICE */}
                <td className="px-4 py-2 truncate">
                  {parseDevice(log?.metadata?.userAgent)}
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}