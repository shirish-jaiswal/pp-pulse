import apiRequest from "@/lib/api/api-request";

export async function c_getAuditLogs(limit: number = 200) {

  const res = await apiRequest({
    method: "GET",
    endpoint: "audit-logs",
    params: { limit },
    requireCookie: true,
  });

  /*console.log("✅ RES FROM API:", res);
  console.log("✅ IS ARRAY:", Array.isArray(res));
  console.log("✅ LENGTH:", res?.length);
*/
  // ✅ ✅ IMPORTANT FIX (do NOT use res.data)
  return res || [];
}