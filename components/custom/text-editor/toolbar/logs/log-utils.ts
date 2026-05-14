export function formatLog(log: any) {
  try {
    return JSON.stringify(log, null, 2);
  } catch {
    return String(log);
  }
}
export function truncateLogs(logs: any[], limit = 20) {
  return logs.slice(0, limit);
}

export function getValueByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}