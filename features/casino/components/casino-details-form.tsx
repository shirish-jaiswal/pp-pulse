"use client";

import { useForm } from "@tanstack/react-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Search } from "lucide-react";
import { CasinoDetailsFormType, CasinoDetailsFormSchema } from "@/features/casino/types/casino-details-input";

interface Props {
  onSubmit: (data: CasinoDetailsFormType) => void;
}

export function CasinoDetailsForm({ onSubmit }: Props) {
  const form = useForm({
    defaultValues: {
      casinoId: "",
      details: "getCasino",
    } as CasinoDetailsFormType,
    validators: {
      onChange: CasinoDetailsFormSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <Card className="shadow-sm border-muted/60 py-0 mb-2">
      <CardContent className="m-1 p-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between gap-4">
            <form.Field
              name="details"
              children={(field) => (
                <Tabs
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange(value as any);

                    setTimeout(() => {
                      if (form.state.values.casinoId) {
                        form.handleSubmit();
                      }
                    }, 0);
                  }}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 h-9 w-full max-w-2xl bg-muted/50">
                    <TabsTrigger value="getCasino" className="text-xs">General</TabsTrigger>
                    <TabsTrigger value="getCasinoConfig" className="text-xs">Config</TabsTrigger>
                    <TabsTrigger value="getOneWalletCasino" className="text-xs">Wallet</TabsTrigger>
                    <TabsTrigger value="getCasinoTables" className="text-xs">Tables</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <form.Field
              name="casinoId"
              children={(field) => (
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={field.name}
                    autoComplete="off"
                    placeholder="Enter Casino ID (e.g., 1001)..."
                    className={`h-9 pl-9 ${
                      field.state.meta.errors.length > 0 
                        ? "border-destructive focus-visible:ring-destructive" 
                        : ""
                    }`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
                onClick={() => form.reset()}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 px-5"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? "..." : "Fetch Details"}
                  </Button>
                )}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}