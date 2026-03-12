"use client"

import * as React from "react"
import { Search, RotateCw, Clock2Icon, Calendar as CalendarIcon, PlusCircle, Check, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isValid } from "date-fns"
import { LogRequestParams, MATCH_PHRASE_OPTIONS, MatchPhraseField } from "@/lib/server/kibana/search"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type KibanaSearchFormProps = {
  onSearch: (params: LogRequestParams) => void
  initialValues: LogRequestParams
}

const INDEX_OPTIONS = ["filebeat-*"]

export function KibanaSearchForm({ onSearch, initialValues }: KibanaSearchFormProps) {
  const today = React.useMemo(() => new Date(), [])

  // Helper to extract time string from ISO
  const getTimeFromISO = React.useCallback((isoString?: string, fallback: string = "00:00:00") => {
    if (!isoString) return fallback
    const date = new Date(isoString)
    return isValid(date) ? date.toTimeString().split(' ')[0] : fallback
  }, [])

  // --- STATE ---
  const [index, setIndex] = React.useState(initialValues?.index || INDEX_OPTIONS[0])
  const [query, setQuery] = React.useState(initialValues?.query || "")
  const [selectedFields, setSelectedFields] = React.useState<string[]>(initialValues?.fields || [])
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    initialValues?.startDate ? new Date(initialValues.startDate) : today
  )
  const [startTime, setStartTime] = React.useState(getTimeFromISO(initialValues?.startDate, "00:00:00"))
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    initialValues?.endDate ? new Date(initialValues.endDate) : today
  )
  const [endTime, setEndTime] = React.useState(getTimeFromISO(initialValues?.endDate, "23:59:59"))
  const [fieldSearch, setFieldSearch] = React.useState("")

  // --- SYNC EFFECT ---
  // This ensures that if the parent component updates initialValues (e.g. via URL params or API),
  // the local form state reflects those changes.
  React.useEffect(() => {
    if (initialValues) {
      setIndex(initialValues.index || INDEX_OPTIONS[0])
      setQuery(initialValues.query || "")
      setSelectedFields(initialValues.fields || [])
      
      if (initialValues.startDate) {
        const d = new Date(initialValues.startDate)
        if (isValid(d)) {
          setStartDate(d)
          setStartTime(d.toTimeString().split(' ')[0])
        }
      }
      
      if (initialValues.endDate) {
        const d = new Date(initialValues.endDate)
        if (isValid(d)) {
          setEndDate(d)
          setEndTime(d.toTimeString().split(' ')[0])
        }
      }
    }
  }, [initialValues, getTimeFromISO])

  // --- LOGIC ---
  const combineDateTime = React.useCallback(
    (date: Date | undefined, time: string) => {
      if (!date) return ""
      const d = new Date(date)
      const [h, m, s] = time.split(":").map(Number)
      d.setHours(h || 0, m || 0, s || 0, 0)
      return d.toISOString()
    },
    []
  )

  const filteredOptions = React.useMemo(() => {
    return MATCH_PHRASE_OPTIONS.filter((option) =>
      option.toLowerCase().includes(fieldSearch.toLowerCase())
    )
  }, [fieldSearch])

  const startISO = combineDateTime(startDate, startTime)
  const endISO = combineDateTime(endDate, endTime)

  const isInvalidRange =
    startDate && endDate ? new Date(startISO) > new Date(endISO) : true

  const handleRefresh = () => {
    if (isInvalidRange) return
    onSearch({
      index,
      query,
      startDate: startISO,
      endDate: endISO,
      sort: initialValues?.sort || "asc",
      fields: selectedFields as MatchPhraseField[],
      matchPhrase: selectedFields.map(f => ({ key: f, value: query }))
    })
  }

  const toggleField = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    )
  }

  return (
    <Card className="border-none shadow-sm ring-1 ring-border w-full py-0">
      <CardContent className="p-4 flex flex-col gap-4">
        {/* FIRST ROW: Index + Search + Field Selector */}
        <div className="flex gap-2 w-full">
          <div className="w-28 shrink-0">
            <Select value={index} onValueChange={setIndex}>
              <SelectTrigger className="bg-muted/50 h-10">
                <SelectValue placeholder="Index" />
              </SelectTrigger>
              <SelectContent>
                {INDEX_OPTIONS.map((idx) => <SelectItem key={idx} value={idx}>{idx}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms..."
              className="pl-8 w-full h-10"
              onKeyDown={(e) => e.key === 'Enter' && handleRefresh()}
            />
          </div>

          <Popover onOpenChange={(open) => !open && setFieldSearch("")}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 border-dashed">
                <PlusCircle className="mr-2 h-4 w-4" />
                Fields
                {selectedFields.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      {selectedFields.length}
                    </Badge>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0 gap-0 shadow-2xl" align="end" >
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Filter fields..."
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto p-1">
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">No fields found.</div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => toggleField(option)}
                      className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer text-sm"
                    >
                      <div className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-colors",
                        selectedFields.includes(option) ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}>
                        {selectedFields.includes(option) && <Check className="h-3 w-3" />}
                      </div>
                      <span className="flex-1 truncate">{option}</span>
                    </div>
                  ))
                )}
              </div>
              {selectedFields.length > 0 && (
                <div className="border-t p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-xs font-normal text-muted-foreground hover:text-destructive"
                    onClick={() => setSelectedFields([])}
                  >
                    <X className="mr-2 h-3 w-3" />
                    Clear selected fields
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* SECOND ROW: Dates + Refresh Button */}
        <div className="flex flex-wrap items-end gap-3">
          {/* FROM DATE */}
          <div className="flex flex-col gap-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal h-10 w-[220px]">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-xs truncate">
                    {startDate && isValid(startDate) ? format(startDate, "MMM dd yyyy") : "Pick date"} @ {startTime}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} className="p-2" />
                <div className="p-3 border-t bg-card">
                  <Field>
                    <FieldLabel>Start Time</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="time"
                        step="1"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                      <InputGroupAddon><Clock2Icon className="h-3 w-3" /></InputGroupAddon>
                    </InputGroup>
                  </Field>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* TO DATE */}
          <div className="flex flex-col gap-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal h-10 w-[220px]">
                  <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
                  <span className="text-xs truncate">
                    {endDate && isValid(endDate) ? format(endDate, "MMM dd yyyy") : "Pick date"} @ {endTime}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} className="p-2" />
                <div className="p-3 border-t bg-card">
                  <Field>
                    <FieldLabel>End Time</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="time"
                        step="1"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                      <InputGroupAddon><Clock2Icon className="h-3 w-3" /></InputGroupAddon>
                    </InputGroup>
                  </Field>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            onClick={handleRefresh} 
            disabled={isInvalidRange} 
            className="h-10 gap-2 px-6 ml-auto"
          >
            <RotateCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}