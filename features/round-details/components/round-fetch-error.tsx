import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorDisplayProps {
  roundId?: string;
  gameId?: string;
  userId?: string;
}

export function RoundFetchError({ roundId, gameId, userId }: ErrorDisplayProps) {
  return (
    <Alert
      variant="destructive"
      className="my-2 border border-red-400/20 bg-red-500/5 text-red-400"
    >
      {/* Icon */}
      <AlertCircle className="h-4 w-4" />

      {/* Title */}
      <AlertTitle className="text-sm font-medium">
        Failed to fetch round details
      </AlertTitle>

      {/* Description */}
      <AlertDescription className="mt-1 text-xs text-red-400/80">
        Check the input parameters and try again.
      </AlertDescription>

      {/* Parameters */}
      {(roundId || gameId || userId) && (
        <div className="mt-3 pt-2 border-t border-red-400/10 text-xs text-muted-foreground font-mono">
          <div className="mb-1">Parameters</div>

          <div className="space-y-0.5">
            {roundId && (
              <div>
                <span className="text-muted-foreground">round:</span> {roundId}
              </div>
            )}
            {gameId && (
              <div>
                <span className="text-muted-foreground">game:</span> {gameId}
              </div>
            )}
            {userId && (
              <div>
                <span className="text-muted-foreground">user:</span> {userId}
              </div>
            )}
          </div>
        </div>
      )}
    </Alert>
  );
}