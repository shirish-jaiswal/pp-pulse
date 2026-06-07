import { Button } from "@/components/ui/button";
import { parseDevice } from "../utils/parseDevice";

export default function ExportButton({ logs }: any) {
  function exportLogs() {
    if (!logs.length) return;

    const csv = [
      ["Time","User","Action","Entity","Value","Status","IP","Device"],
      ...logs.map((log: any) => [
        new Date(log.timestamp).toISOString(),
        log.actorEmail,
        log.action,
        log.entityType,
        log.entityValue,
        log.status,
        log.sourceIp,
        parseDevice(log?.metadata?.userAgent),
      ]),
    ].map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "audit_logs.csv";
    link.click();
  }

  return (
    <Button onClick={exportLogs} className="bg-green-600 text-white">
      Export CSV
    </Button>
  );
}