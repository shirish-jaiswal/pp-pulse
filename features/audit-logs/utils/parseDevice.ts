export function parseDevice(userAgent?: string) {
  if (!userAgent) return "Unknown";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Postman")) return "Postman";
  if (userAgent.includes("Windows")) return "Windows";
  return "Other";
}