"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlayCircle, Hash, Clock, CircleOff, Search } from "lucide-react";
import { GameConfig } from "@/features/casino/types/game-config";

export function GameTableView({ data }: { data: GameConfig[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const games = Array.isArray(data) ? data : [];

  const filteredGames = useMemo(() => {
    return games.filter((game) =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.operatorGameId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [games, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search games or IDs..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredGames.map((game, index) => (
            <Card
              key={`${game.operatorGameId}-${game.name}-${index}`}
              className={`border-none shadow-sm ring-1 transition-all ${
                game.status
                  ? "ring-border hover:ring-emerald-500/50"
                  : "ring-border opacity-75 grayscale-[0.5]"
              } p-0 gap-0`}
            >
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  {game.status ? (
                    <PlayCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <CircleOff className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <CardTitle className="text-sm font-bold truncate">
                    {game.name}
                  </CardTitle>
                </div>
                <Badge
                  variant={game.status ? "default" : "secondary"}
                  className="text-[9px] font-mono px-1.5 py-0"
                >
                  {game.status ? "ACTIVE" : "OFFLINE"}
                </Badge>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-end mt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Operator ID
                    </p>
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs font-mono font-medium">
                        {game.operatorGameId}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Open Time
                    </p>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span className="text-[10px] font-bold">
                        {game.openTime
                          ? new Date(game.openTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No games match "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="text-sm text-primary underline mt-2"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}