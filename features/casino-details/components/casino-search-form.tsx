"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/* ✅ MUST start with letter + exactly 16 chars */
const CASINO_RE = /^[A-Za-z][A-Za-z0-9]{15}$/;

type CasinoSearchFormProps = {
  onSubmit: (casinoId: string) => void;
  loading: boolean;
  initialValue?: string;
};

export function CasinoSearchForm({
  onSubmit,
  loading,
  initialValue,
}: CasinoSearchFormProps) {

  const [casinoId, setCasinoId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValue && !casinoId) {
      setCasinoId(initialValue);
    }
  }, [initialValue]);

  /* ✅ SUBMIT HANDLER */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ CLEAN VALUE (REMOVE ALL SPACES)
    const val = casinoId.replace(/\s/g, "");

    if (!CASINO_RE.test(val)) {
      setError("Invalid casino ID");
      return;
    }

    setError("");
    onSubmit(val);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">

      <div className="flex flex-col">

        <Input
          placeholder="e.g. ppcdk00000003410"
          value={casinoId}
          maxLength={16}
          onChange={(e) => {

            // ✅ REMOVE ALL SPACES (START + MID + END)
            const val = e.target.value.replace(/\s/g, "");

            setCasinoId(val);

            // ✅ RULE 1: first character must be letter → immediate error
            if (val.length > 0 && !/[A-Za-z]/.test(val[0])) {
              setError("Invalid casino ID");
              return;
            }

            // ✅ RULE 2: validate only when length = 16
            if (val.length === 16) {
              if (!CASINO_RE.test(val)) {
                setError("Invalid casino ID");
              } else {
                setError("");
              }
            } else {
              // ✅ typing stage → no error
              setError("");
            }
          }}
          disabled={loading}
          className="h-9 text-sm w-[260px]"
        />

        {error && (
          <p className="text-red-500 text-xs mt-1">
            {error}
          </p>
        )}

      </div>

      <Button
        type="submit"
        size="sm"
        disabled={loading || !CASINO_RE.test(casinoId)}
        className="min-w-[90px]"
      >
        {loading ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            Fetching
          </span>
        ) : (
          "Fetch"
        )}
      </Button>

    </form>
  );
}