"use client";

import React from "react";
import { RoundDetailsForm } from "./round-details-form";
import { PlayerBetTxnInfoProps } from "@/types/round-details-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoundDataDisplay } from "./round-data-diaplay";

export function RoundDetailsWrapper() {
  const [queryParams, setQueryParams] = React.useState<PlayerBetTxnInfoProps | null>(null);

  const defaultParams: PlayerBetTxnInfoProps = {
    game_id: "",
    gameParamId: "round_id",
    playerParamId: "user_id",
    user_id: ""
  };

  // const { data, isLoading, error } = usePlayerBetTxnInfo(queryParams || defaultParams);
  const data = { exist : true};
  const isLoading = false;
  const error = { error: "" , mesage: "" };
  const handleFormSubmit = (data: PlayerBetTxnInfoProps) => {
    const finalData = { ...data, user_id: data.gameParamId === "round_id" ? "" : data.user_id };
    setQueryParams(finalData);
  };

  return (
    <div className="space-y-6">
      <RoundDetailsForm onSubmit={handleFormSubmit} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24 border border-dashed rounded-xl bg-muted/5 animate-pulse">
          <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
          <p className="mt-4 text-sm font-medium text-muted-foreground tracking-tight">
            Syncing with BackOffice Ledger...
          </p>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="border-red-200 bg-red-50/50">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold">Fetch Failed</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <p>{error.mesage || "An unexpected error occurred."}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQueryParams({ ...queryParams } as any)}
              className="w-fit gap-2 bg-white hover:bg-red-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Request
            </Button>
          </AlertDescription>
        </Alert>
      ) : !data || !data.exist ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <Database className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Round Selected</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Enter a valid Round ID above to pull real-time data from the BackOffice.
          </p>
        </div>
      ) : (
        /* UI is now delegated to the display component */
        <RoundDataDisplay data={data} />
      )}
    </div>
  );
}