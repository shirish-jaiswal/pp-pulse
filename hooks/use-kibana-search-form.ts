"use client"

import * as React from "react"
import { isValid } from "date-fns"
import { 
  LogRequestParams, 
  MatchPhraseData, 
} from "@/lib/server/kibana/search"
import { getTimeFromISO, combineDateTime } from "@/utils/date-utils"

export const INDEX_OPTIONS = ["filebeat-*"]

export function useKibanaSearchForm(
  initialValues: LogRequestParams, 
  onSearch: (params: LogRequestParams) => void
) {
  const today = React.useMemo(() => new Date(), [])

  // --- State ---
  const [index, setIndex] = React.useState(initialValues?.index || INDEX_OPTIONS[0])
  const [query, setQuery] = React.useState(initialValues?.query || "")
  const [selectedFields, setSelectedFields] = React.useState<string[]>(initialValues?.fields || [])
  const [matchPhrase, setMatchPhrase] = React.useState<MatchPhraseData[]>(initialValues?.matchPhrase || [])
  
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    initialValues?.startDate ? new Date(initialValues.startDate) : today
  )
  const [startTime, setStartTime] = React.useState(getTimeFromISO(initialValues?.startDate, "00:00:00"))
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    initialValues?.endDate ? new Date(initialValues.endDate) : today
  )
  const [endTime, setEndTime] = React.useState(getTimeFromISO(initialValues?.endDate, "23:59:59"))
  
  // --- Syncing initial values ---
  React.useEffect(() => {
    if (initialValues) {
      setIndex(initialValues.index || INDEX_OPTIONS[0])
      setQuery(initialValues.query || "")
      setSelectedFields(initialValues.fields || [])
      setMatchPhrase(initialValues.matchPhrase || [])
      
      if (initialValues.startDate && isValid(new Date(initialValues.startDate))) {
        const d = new Date(initialValues.startDate)
        setStartDate(d)
        setStartTime(d.toTimeString().split(' ')[0])
      }
      if (initialValues.endDate && isValid(new Date(initialValues.endDate))) {
        const d = new Date(initialValues.endDate)
        setEndDate(d)
        setEndTime(d.toTimeString().split(' ')[0])
      }
    }
  }, [initialValues])

  const startISO = combineDateTime(startDate, startTime)
  const endISO = combineDateTime(endDate, endTime)
  const isInvalidRange = startDate && endDate ? new Date(startISO) > new Date(endISO) : true

  // --- Actions ---
  const handleRefresh = () => {
    if (isInvalidRange) return
    onSearch({
      index,
      query,
      startDate: startISO,
      endDate: endISO,
      sort: initialValues?.sort || "asc",
      fields: selectedFields,
      matchPhrase: matchPhrase 
    })
  }

  const toggleField = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    )
  }

  // --- MatchPhrase Actions ---
  const removeMatchPhrase = (indexToRemove: number) => {
    setMatchPhrase(prev => prev.filter((_, i) => i !== indexToRemove));
    handleRefresh();
  }

  const toggleMatchPhraseStatus = (indexToToggle: number) => {
    setMatchPhrase(prev => prev.map((item, i) => 
      i === indexToToggle ? { ...item, isDisabled: !item.isDisabled } : item
    ));
    handleRefresh();
  }

  const editMatchPhrase = (indexToEdit: number, newKey: string, newValue: string, isPositive?: boolean) => {
    setMatchPhrase(prev => prev.map((item, i) =>
      i === indexToEdit ? { ...item, key: newKey, value: newValue, isPositive: isPositive ?? item.isPositive } : item
    ));
    handleRefresh();
  }

  return {
    state: { 
      index, query, selectedFields, matchPhrase, 
      startDate, startTime, endDate, endTime, isInvalidRange 
    },
    actions: { 
      setIndex, setQuery, setStartDate, setStartTime, 
      setEndDate, setEndTime, setSelectedFields, setMatchPhrase,
      toggleField, removeMatchPhrase, toggleMatchPhraseStatus, editMatchPhrase, handleRefresh 
    }
  }
}