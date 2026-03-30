"use client"

import * as React from "react"
import { Search, RotateCw, Clock2Icon, Calendar as CalendarIcon, PlusCircle, Check, X, Filter } from "lucide-react"
import { format, isValid } from "date-fns"

import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { LogRequestParams, MATCH_PHRASE_OPTIONS } from "@/lib/server/kibana/search"
import { useKibanaSearchForm, INDEX_OPTIONS } from "@/hooks/use-kibana-search-form"
import { cn } from "@/utils/cn"
import { KibanaFilterPill } from "./kibana-filter-pill"

type KibanaSearchFormProps = {
  onSearch: (params: LogRequestParams) => void
  initialValues: LogRequestParams
}

export function KibanaSearchForm({ onSearch, initialValues }: KibanaSearchFormProps) {
  const { state, actions } = useKibanaSearchForm(initialValues, onSearch)
  const [fieldSearch, setFieldSearch] = React.useState("")
  const filteredFields = React.useMemo(() => {
    return MATCH_PHRASE_OPTIONS.filter((opt) =>
      opt.toLowerCase().includes(fieldSearch.toLowerCase())
    )
  }, [fieldSearch])


  return (
    <Card className="border-none rounded-none ring-0 w-full p-0 flex flex-col gap-1 shadow-none bg-background">
      {/* ROW 1: Index, Search, and Field Selection */}
      <div className="flex gap-2 w-full items-center">
        <Select value={state.index} onValueChange={actions.setIndex}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Index" />
          </SelectTrigger>
          <SelectContent>
            {INDEX_OPTIONS.map((idx) => (
              <SelectItem key={idx} value={idx} className="text-xs">{idx}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            value={state.query}
            onChange={(e) => actions.setQuery(e.target.value)}
            placeholder="Search terms... (e.g. status:200)"
            className="pl-9 h-8 text-xs focus-visible:ring-1"
            onKeyDown={(e) => e.key === 'Enter' && actions.handleRefresh()}
          />
        </div>

        <Popover onOpenChange={(open) => !open && setFieldSearch("")}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed text-xs">
              <PlusCircle className="mr-2 h-3 w-3" />
              Columns
              {state.selectedFields.length > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal text-[10px]">
                    {state.selectedFields.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0 shadow-2xl" align="end">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-10 w-full bg-transparent py-3 text-xs outline-none"
                placeholder="Filter fields..."
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
              />
            </div>
            <div className="max-h-72 overflow-y-auto p-1">
              {filteredFields.map((field) => (
                <div
                  key={field}
                  onClick={() => actions.toggleField(field)}
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer text-xs"
                >
                  <div className={cn(
                    "flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-primary transition-colors",
                    state.selectedFields.includes(field) ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    {state.selectedFields.includes(field) && <Check className="h-3 w-3" />}
                  </div>
                  <span className="flex-1 truncate">{field}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* ROW 2: Match Phrase Filters (The "Pills") */}
      {state.matchPhrase && state.matchPhrase.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center min-h-[2rem]">
          <Filter className="h-3 w-3 text-muted-foreground mr-1" />

          {state.matchPhrase.map((phrase, idx) => (
            <KibanaFilterPill
              key={`${phrase.key}-${idx}`}
              phrase={phrase}
              index={idx}
              onRemove={actions.removeMatchPhrase}
              onToggleDisable={actions.toggleMatchPhraseStatus}
            />
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] text-muted-foreground"
            onClick={() => actions.setMatchPhrase([])}
          >
            Clear
          </Button>
        </div>
      )}

      {/* ROW 3: Date Pickers and Submit */}
      <div className="flex flex-wrap items-center gap-2">
        <DatePickerWithTime
          label="Start Time"
          date={state.startDate}
          time={state.startTime}
          onDateChange={actions.setStartDate}
          onTimeChange={actions.setStartTime}
          iconColor="text-blue-500"
        />

        <DatePickerWithTime
          label="End Time"
          date={state.endDate}
          time={state.endTime}
          onDateChange={actions.setEndDate}
          onTimeChange={actions.setEndTime}
          iconColor="text-orange-500"
        />

        <Button
          onClick={actions.handleRefresh}
          disabled={state.isInvalidRange}
          size="sm"
          className="h-8 gap-2 px-4 ml-auto bg-primary"
        >
          <RotateCw className={cn("h-3.5 w-3.5", state.isInvalidRange && "opacity-50")} />
          Update Results
        </Button>
      </div>
    </Card>
  )
}

function DatePickerWithTime({ label, date, time, onDateChange, onTimeChange, iconColor }: any) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal h-8 px-3">
          <CalendarIcon className={cn("mr-2 h-3.5 w-3.5", iconColor)} />
          <span className="text-xs">
            {date && isValid(date) ? format(date, "MMM dd, yyyy") : "Pick date"} <span className="text-muted-foreground ml-1">@ {time}</span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onDateChange} initialFocus />
        <div className="p-3 border-t">
          <div className="flex items-center gap-2">
            <Clock2Icon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">{label}</span>
          </div>
          <Input
            type="time"
            step="1"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="mt-2 h-8 text-xs"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}