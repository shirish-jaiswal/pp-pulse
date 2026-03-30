import { isValid } from "date-fns"

export const getTimeFromISO = (isoString?: string, fallback: string = "00:00:00") => {
  if (!isoString) return fallback
  const date = new Date(isoString)
  return isValid(date) ? date.toTimeString().split(' ')[0] : fallback
}

export const combineDateTime = (date: Date | undefined, time: string) => {
  if (!date) return ""
  const d = new Date(date)
  const [h, m, s] = time.split(":").map(Number)
  d.setHours(h || 0, m || 0, s || 0, 0)
  return d.toISOString()
}