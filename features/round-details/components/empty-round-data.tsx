import { AlertCircle } from "lucide-react";

export default function EmptyRoundData() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">

      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted/40 mb-3">
        <AlertCircle className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-foreground">
        No round data found
      </h3>

      {/* Description */}
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Check the <span className="text-foreground">Round ID</span>,{" "}
        <span className="text-foreground">Game ID</span>, or{" "}
        <span className="text-foreground">User ID</span> and try again.
      </p>
    </div>
  );
}