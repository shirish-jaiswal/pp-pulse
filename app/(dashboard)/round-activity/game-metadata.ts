import { GameMetaData } from "@/features/round-details/context/round-details-context";
import { getGameType } from "@/utils/get-game-type";

export default function generateGameMetaData(
  data?: any | null
): GameMetaData[] {
  if (!data) return [];

  const d = Array.isArray(data)
    ? data[0] ?? {}
    : data ?? {};

  const gameType = getGameType(d?.game_type);
  const isCrashGame = gameType === "crash-game";

  const resultValue = isCrashGame
    ? d?.state_indicator != null
      ? `${Number(d.state_indicator) / 100}x`
      : "-"
    : d?.Description ?? "-";

  return [
    {
      label: "Game",
      value: d?.game_type ?? "-",
      isTechnical: false,
    },
    {
      label: "Table",
      value: d?.table_name ?? "-",
      isTechnical: false,
    },
    {
      label: "Table ID",
      value: d?.table_id ?? "-",
      isTechnical: true,
    },
    {
      label: "IP",
      value: d?.IP ?? "-",
      isTechnical: true,
    },
    {
      label: "Game Time",
      value: d?.game_time ? new Date(d.game_time).toLocaleString() : "-",
      isTechnical: false,
    },
    {
      label: "Result",
      value: resultValue,
      isTechnical: false,
      showPopupOf: gameType
    },
    {
      label: "Result Time",
      value: d?.result_time
        ? new Date(d.result_time).toLocaleString()
        : "-",
      isTechnical: false,
    },
  ];
}