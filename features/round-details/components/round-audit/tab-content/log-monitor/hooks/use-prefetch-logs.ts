// hooks/use-prefetch-transaction-logs.ts

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { c_getTransactionLogs } from "@/lib/api/round-details/transaction-logs";

interface Params {
  roundId?: string;
  timeStamp?: string;
  game_id?: string;
  user_id?: string;
  game_type?: string;
}

export function usePrefetchTransactionLogs({
  roundId,
  timeStamp,
  game_id,
  user_id,
  game_type,
}: Params) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!roundId || !timeStamp) return;

    queryClient.prefetchQuery({
      queryKey: ["logs", { roundId, timeStamp, game_id, user_id, game_type }],
      queryFn: () =>
        c_getTransactionLogs({
          roundId,
          timeStamp,
          game_id,
          user_id,
          game_type,
        }),
    });
  }, [roundId, timeStamp, game_id, user_id, game_type]);
}