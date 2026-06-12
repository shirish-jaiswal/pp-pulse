"use client";

import { useState } from "react";
import { syncFreshdeskArticles } from "@/lib/api/freshdesk/s_syncFreshdeskArticles";
import { Loader2, RefreshCw, CheckCircle2, AlertCircle, Database } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SyncArticlesTab() {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{
    success: boolean;
    count?: number;
    error?: string;
  } | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const result = await syncFreshdeskArticles();
      
      if (result.success) {
        setSyncStatus({ success: true, count: result.count });
      } else {
        setSyncStatus({ 
          success: false, 
          error: result.error || "An unknown error occurred during sync." 
        });
      }
    } catch (err: any) {
      setSyncStatus({
        success: false,
        error: err.message || "Failed to trigger server action.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-muted-foreground text-sm">
          <Database className="h-4 w-4" />
          <span>Knowledge Base Utilities</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Freshdesk Synchronization
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Pull documentation dynamically from Freshdesk folders and ingest it directly into your flat file ExcelDB database infrastructure.
        </p>
      </div>

      <Separator />

      {/* Main Control Card */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
          <div className="space-y-1.5 pr-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              Sync Pipeline Status
              {isSyncing && (
                <Badge variant="secondary" className="animate-pulse bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400">
                  Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm max-w-lg leading-relaxed">
              Paginates through documentation elements at 100 items per index page block. Auto-safeguarded against local spreadsheet character limitations.
            </CardDescription>
          </div>

          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="min-w-[160px] shadow-sm transition-all"
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Sync
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Trigger Ingestion
              </>
            )}
          </Button>
        </CardHeader>

        {/* Action Status Output Wrapper */}
        {syncStatus && (
          <CardContent className="pt-0 border-t bg-muted/20 p-6 rounded-b-xl">
            {syncStatus.success ? (
              <Alert variant="default" className="border-green-200/80 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900/50">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300 font-medium">
                  Pipeline Completed Successfully
                </AlertTitle>
                <AlertDescription className="text-green-700/90 dark:text-green-400/90 mt-1">
                  Ingested <span className="font-semibold text-green-900 dark:text-green-200">{syncStatus.count}</span> text schema rows successfully without formatting conflicts.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="bg-destructive/5 dark:bg-destructive/10 border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-medium">Sync Execution Halted</AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="text-xs font-mono bg-background/80 border rounded-md p-3 select-all max-h-[120px] overflow-y-auto leading-relaxed text-destructive-foreground">
                    {syncStatus.error}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}