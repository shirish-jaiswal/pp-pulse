export type DateRangeValue = {
  from?: Date
  to?: Date
}

export type RelativeTimeUnit =
  | "minutes"
  | "hours"
  | "days"
  | "weeks"

export type QuickRangePreset = {
  label: string
  value: string
}