export default function KPICards({ logs }: any) {
  const totalLogs = logs.length;

  const uniqueUsers = new Set(logs.map((l: any) => l.actorEmail)).size;

  const successCount = logs.filter((l: any) => l.status === "SUCCESS").length;

  const failureCount = logs.filter((l: any) => l.status !== "SUCCESS").length;

  const cards = [
    { label: "Total Logs", value: totalLogs },
    { label: "Unique Users", value: uniqueUsers },
    { label: "Success", value: successCount },
    { label: "Failures", value: failureCount },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-500">{card.label}</p>
          <p className="text-xl font-semibold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}