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

export const formatDate_intl = (dateStr: string | Date) => {
  const date = new Date(dateStr);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const parts = timeFormatter.formatToParts(date);
  const datePart = date.toLocaleDateString("en-US");
  const ms = date.getMilliseconds().toString().padStart(3, "0");

  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;
  const second = parts.find((p) => p.type === "second")?.value;
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value;

  return `${datePart}, ${hour}:${minute}:${second}.${ms} ${dayPeriod}`;
};

export const formatDate = (dateStr: string | Date) => {
  const d = typeof dateStr === "string" ? dateStr : dateStr.toISOString();
  const [date, time] = d.replace("Z", "").split("T");
  return `${date} ${time}`;
};