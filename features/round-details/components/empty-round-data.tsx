import { AlertCircle } from "lucide-react";

export default function EmptyRoundData() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 p-10 text-center shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
        <AlertCircle className="w-6 h-6 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        No Round Data Found
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We couldn’t retrieve any round details. Please verify the{" "}
        <span className="font-medium text-foreground">
          Round ID, Game ID, and User ID
        </span>{" "}
        and try again.
      </p>
    </div>
  );
}