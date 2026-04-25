import { GameMetaData } from "@/features/round-details/context/round-details-context";

export default function generateGameMetaData(
  data?: any | null
): GameMetaData[] {
  if (!data) return [];

  const d = Array.isArray(data) ? data[0] : data;

  return [
    {
      label: "Table ID",
      value: d.table_id ?? "-",
      isTechnical: true,
    },
    {
      label: "Table Name",
      value: d.table_name ?? "-",
      isTechnical: false,
    },
    {
      label: "Game Type",
      value: d.game_type ?? "-",
      isTechnical: false,
    },
    {
      label: "Game Time",
      value: d.game_time
        ? new Date(d.game_time).toLocaleString()
        : "-",
      isTechnical: false,
    },
    {
      label: "IP Address",
      value: d.IP ?? "-",
      isTechnical: true,
    },
    {
      label: "Description",
      value: d.Description ?? "-",
      isTechnical: false,
    },
    {
      label: "Result Code",
      value: d.resultcode_id ?? "-",
      isTechnical: true,
    },
    {
      label: "Result Time",
      value: d.result_time
        ? new Date(d.result_time).toLocaleString()
        : "-",
      isTechnical: false,
    },
  ];
}