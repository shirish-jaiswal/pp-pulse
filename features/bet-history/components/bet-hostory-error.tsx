import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBetHistory } from "../context/bet-history-context";

export function BetHistoryError() {
  const { input } = useBetHistory();

  const { playerId, from, to } = input;

  return (
    <Alert
      variant="destructive"
      className="my-2 border border-red-400/20 bg-red-500/5 text-red-400"
    >
      {/* Icon */}
      <AlertCircle className="h-4 w-4" />

      {/* Title */}
      <AlertTitle className="text-sm font-medium">
        Failed to fetch bet history
      </AlertTitle>

      {/* Description */}
      <AlertDescription className="mt-1 text-xs text-red-400/80">
        Something went wrong while fetching data. Try again or adjust filters.
      </AlertDescription>

      {/* Parameters */}
      {(playerId || from || to) && (
        <div className="mt-3 pt-2 border-t border-red-400/10 text-xs text-muted-foreground font-mono">
          <div className="mb-1">Filters</div>

          <div className="space-y-0.5">
            {playerId && (
              <div>
                <span className="text-muted-foreground">player:</span>{" "}
                {playerId}
              </div>
            )}

            {from && (
              <div>
                <span className="text-muted-foreground">from:</span> {from}
              </div>
            )}

            {to && (
              <div>
                <span className="text-muted-foreground">to:</span> {to}
              </div>
            )}
          </div>
        </div>
      )}
    </Alert>
  );
}