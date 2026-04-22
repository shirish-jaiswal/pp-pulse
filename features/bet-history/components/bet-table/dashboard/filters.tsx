"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBetHistory } from "@/features/bet-history/context/bet-history-context";

import { useMemo } from "react";

type Props = {
  gameId: string;
  setGameId: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
};

export function Filters({ gameId, setGameId, status, setStatus }: Props) {
  const { data } = useBetHistory();

  const gameIds = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.GameId?.trim())));
  }, [data]);

  const statuses = useMemo(() => {
    return ["WIN", "LOSS", "BREAKEVEN"];
  }, []);

  return (
    <div className="flex gap-1  mb-1">
      {/* GAME FILTER */}
      <Select value={gameId} onValueChange={setGameId}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Game ID" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Games</SelectItem>

          {gameIds.map((id) => (
            <SelectItem key={id} value={id}>
              {id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* STATUS FILTER */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All</SelectItem>

          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}