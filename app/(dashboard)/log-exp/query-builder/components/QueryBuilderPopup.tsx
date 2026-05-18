import React, { useState } from "react"; // Added useState
import * as Popover from "@radix-ui/react-popover";
import { QueryBuilderProvider } from "../context/QueryBuilderContext";
import QueryBuilderContent from "./QueryBuilderContent";
import { Filter } from "lucide-react";
import { parseDsl } from "../utils/parseDsl";
import { Button } from "@/components/ui/button";

export default function QueryBuilderPopup(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const dsl = {
  "bool": {
    "must": [],
    "filter": [
      {
        "bool": {
          "minimum_should_match": 1,
          "should": [
            {
              "match_phrase": {
                "message": "decision"
              }
            },
            {
              "match_phrase": {
                "message": "error"
              }
            }
          ]
        }
      }
    ],
    "should": [],
    "must_not": [
      {
        "bool": {
          "minimum_should_match": 1,
          "should": [
            {
              "match_phrase": {
                "contextMap.uuId": "008c1111418d435e86ac2f75ecb90fb5"
              }
            }
          ]
        }
      }
    ]
  }
}

const queryState = parseDsl(dsl);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          size={"lg"}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 data-[state=open]:bg-slate-50 transition-colors"
        >
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          Filters
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={6}
          className="z-50 outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-100"
        >
          <QueryBuilderProvider initialState={queryState}>
            <QueryBuilderContent onClose={() => setOpen(false)} />
          </QueryBuilderProvider>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}