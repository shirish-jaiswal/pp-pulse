"use client";

import React from "react";
import { CasinoDetailsForm } from "@/features/casino/components/casino-details-form";
import { CasinoDetailsFormType } from "@/features/casino/types/casino-details-input";
import { useCasinoDetails } from "@/features/casino/hooks/use-casino-details";
import { Loader2, AlertCircle, Database} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GeneralInfoView } from "@/features/casino/components/general-info-view";
import { GameTableView } from "@/features/casino/components/game-tables-view";
import { WalletView } from "@/features/casino/components/wallet-view";
import { ConfigView } from "@/features/casino/components/config-view";
import { CasinoDetails } from "@/features/casino/types/details";
import { OneWalletConfig } from "@/features/casino/types/one-wallet-config";
import { CasinoConfig } from "@/features/casino/types/config";
import { GameConfig } from "@/features/casino/types/game-config";

export function CasinoDetailsWrapper() {
  const [queryParams, setQueryParams] = React.useState<CasinoDetailsFormType | null>(null);

  const { data, isLoading, error, refetch } = useCasinoDetails(queryParams);

  const handleFormSubmit = (values: CasinoDetailsFormType) => {
    setQueryParams(values);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CasinoDetailsForm onSubmit={handleFormSubmit} />
        <div className="flex flex-col items-center justify-center p-24 border border-dashed rounded-xl bg-muted/5">
          <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Fetching Casino {queryParams?.details} metadata...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <CasinoDetailsForm onSubmit={handleFormSubmit} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            {error.message || "Failed to fetch casino details."}
            <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CasinoDetailsForm onSubmit={handleFormSubmit} />

      {!data ? (
        <div className="flex flex-col items-center justify-center p-20 text-center border rounded-xl bg-slate-50/50">
          <Database className="h-10 w-10 text-slate-300 mb-4" />
          <h3 className="font-bold text-slate-900">No Casino Selected</h3>
          <p className="text-sm text-slate-500">Provide a Casino ID to view configuration and table data.</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {queryParams?.details === "getCasino" && (
            <GeneralInfoView data={data as CasinoDetails} />
          )}
          
          {queryParams?.details === "getCasinoConfig" && (
            <ConfigView data={data as CasinoConfig} />
          )}

          {queryParams?.details === "getOneWalletCasino" && (
            <WalletView data={data as OneWalletConfig} />
          )}

          {queryParams?.details === "getCasinoTables" && (
            <GameTableView data={data as GameConfig[]} />
          )}
        </div>
      )}
    </div>
  );
}