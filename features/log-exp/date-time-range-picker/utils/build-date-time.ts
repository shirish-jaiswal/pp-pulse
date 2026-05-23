export function buildDateTime(date: Date, time: string) {
  const next = new Date(date)

  const [hours, minutes, seconds = 0] = time
    .split(":")
    .map(Number)

  next.setUTCHours(
    hours,
    minutes,
    seconds,
    0
  )

  return next
}