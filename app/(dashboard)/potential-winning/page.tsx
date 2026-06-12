"use client";

import React, { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useGetAllPayoutsByGameName } from "@/hooks/excel-db/use-get-all-payout-by-game-name";
import { useGetPayoutGameList } from "@/hooks/excel-db/use-get-payout-games-list";
import { PayoutRow } from "./types";
import { parseIncomingMessage } from "./xml-parser";
import { getGameStrategy } from "./strategies";
import { evaluateBaccaratHands } from "./baccarat-utils";
import { BaccaratPanel } from "./baccarat-panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/utils/cn";
import { CalculationTable } from "./calculation-table";
import { Rank, Suit } from "@/components/custom/games/playing-card";

export default function PotentialWinning() {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [rawXmlMessage, setRawXmlMessage] = useState<string>("");
  const [selectedResultBc, setSelectedResultBc] = useState<string>("");

  const [openTablePicker, setOpenTablePicker] = useState(false);
  const [openOutcomePicker, setOpenOutcomePicker] = useState(false);

  const [playerCards, setPlayerCards] = useState<{ rank: Rank; suit: Suit }[]>([{ rank: "A", suit: "S" }, { rank: "A", suit: "H" }]);
  const [bankerCards, setBankerCards] = useState<{ rank: Rank; suit: Suit }[]>([{ rank: "2", suit: "D" }, { rank: "3", suit: "C" }]);

  const { data: gameTables, isLoading: isLoadingTables } = useGetPayoutGameList();
  const { data: payouts, isLoading: isLoadingPayouts } = useGetAllPayoutsByGameName(selectedTable);

  const parsedBets = useMemo(() => parseIncomingMessage(rawXmlMessage), [rawXmlMessage]);
  const isBaccarat = selectedTable.toLowerCase().includes("baccarat");

  const baccaratTelemetry = useMemo(() => isBaccarat ? evaluateBaccaratHands(playerCards, bankerCards) : null, [isBaccarat, playerCards, bankerCards]);

  const selectedOutcomeLabel = useMemo(() => {
    if (!selectedResultBc || !payouts) return "Select Result";
    const m = payouts.find((p: PayoutRow) => String(p.bet_codes) === selectedResultBc);
    return m ? `${m.description} (${m.payout})` : "Select Result";
  }, [selectedResultBc, payouts]);

  // FIXED: Explicitly forward the live card state context right to the calculator
  const calculationResult = useMemo(() => {
    if (!selectedResultBc || !payouts || parsedBets.length === 0 || !selectedTable) return null;
    return getGameStrategy(selectedTable).calculate(selectedResultBc, payouts, parsedBets, {
      playerCards,
      bankerCards,
    });
  }, [selectedResultBc, payouts, parsedBets, selectedTable, playerCards, bankerCards]);

  return (
    <div className="w-full p-2 bg-slate-50/50 rounded border border-slate-200/80 space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        {/* 1. Game Selector */}
        <Popover open={openTablePicker} onOpenChange={setOpenTablePicker}>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("h-9 w-full justify-between bg-white text-xs font-normal border-slate-200 px-3 shadow-none", selectedTable && "text-slate-900 font-medium")}>
              <span className="truncate">{selectedTable || "Select Table"}</span>
              <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-40" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0 bg-white border border-slate-200 shadow-md rounded-md">
            <Command>
              <CommandInput placeholder="Search tables..." className="h-8 text-xs" />
              <CommandList className="max-h-[200px]">
                <CommandEmpty className="py-2 text-center text-xs text-slate-400">No results</CommandEmpty>
                <CommandGroup>
                  {gameTables?.map((t: string) => (
                    <CommandItem key={t} value={t} onSelect={(v) => { setSelectedTable(v); setSelectedResultBc(""); setOpenTablePicker(false); }} className="text-xs py-1.5 cursor-pointer">{t}</CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* 2. Log Input */}
        <div className="relative w-full">
          <Input className="h-9 text-xs pr-16 bg-white font-mono placeholder:font-sans" placeholder="Paste Incoming..." value={rawXmlMessage} onChange={(e) => setRawXmlMessage(e.target.value)} />
          {parsedBets.length > 0 && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{parsedBets.length} Bets</span>}
        </div>

        {/* 3. Outcome Picker Dropdown */}
        <Popover open={openOutcomePicker} onOpenChange={openOutcomePicker => setOpenOutcomePicker(openOutcomePicker)}>
          <PopoverTrigger asChild>
            <Button variant="outline" disabled={!selectedTable || isLoadingPayouts} className={cn("h-9 w-full justify-between bg-white text-xs font-normal border-slate-200 px-3 shadow-none", selectedResultBc && "text-slate-900 font-medium")}>
              <span className="truncate">{selectedOutcomeLabel}</span>
              <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-40" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0 bg-white border border-slate-200 shadow-md rounded-md" align="end">
            <Command>
              <div className="flex items-center border-b px-2 bg-slate-50/50"><Search className="h-3.5 w-3.5 text-slate-400 mr-2" /><CommandInput placeholder="Search criteria..." className="h-8 text-xs" /></div>
              <CommandList className="max-h-[220px]">
                <CommandEmpty className="py-2 text-center text-xs text-slate-400">No options</CommandEmpty>
                <CommandGroup>
                  {payouts?.filter((p: PayoutRow) => {
                    if (isBaccarat) {
                      // Limits form selection context exclusively to principal base wagers
                      return ["0", "1", "2"].includes(String(p.bet_codes));
                    }
                    return true;
                  }).map((p: PayoutRow) => {
                    const isSuggested = baccaratTelemetry?.calculatedBetCodes.includes(String(p.bet_codes));
                    return (
                      <CommandItem key={p.id} value={`${p.description} ${p.bet_codes}`} onSelect={() => { setSelectedResultBc(String(p.bet_codes)); setOpenOutcomePicker(false); }} className={cn("text-xs py-1.5 flex justify-between cursor-pointer", isSuggested && "bg-emerald-50/50 font-medium text-slate-900 hover:bg-emerald-50")}>
                        <span>{p.description}</span>
                        <span className="text-[10px] font-mono text-slate-400">{p.payout}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
{/* 
      {isBaccarat && baccaratTelemetry && (
        <BaccaratPanel playerCards={playerCards} bankerCards={bankerCards} metrics={baccaratTelemetry} onChange={(type, cards) => type === "player" ? setPlayerCards(cards) : setBankerCards(cards)} />
      )} */}

      {calculationResult && (
        <CalculationTable winningDescription={calculationResult.winningDescription} selectedResultBc={selectedResultBc} winningRatio={calculationResult.winningRatio} details={calculationResult.details} totalWager={calculationResult.totalWager} totalPayout={calculationResult.totalPayout} />
      )}
    </div>
  );
}