import apiRequest from "@/lib/api/api-request";

export async function c_getAuditLogs(limit: number = 20000) {

  const res = await apiRequest({
    method: "GET",
    endpoint: "audit-logs",
    params: { limit },
    requireCookie: true,
  });

  return res || [];
}