export const SUPPORT_FIELDS = [
  { value: "message", label: "Log Message" },
  { value: "_id", label: "ID Keyword" },
  { value: "status", label: "HTTP Status" },
  { value: "service_name", label: "Service Name" },
  { value: "trace_id", label: "Trace ID" },
  { value: "severity", label: "Severity" },
  { value: "user_id", label: "User ID" },
  { value: "account_id", label: "Account ID" },
  { value: "exception.class", label: "Error Class" },
  { value: "host.ip", label: "Host IP" },
  { value: "request.method", label: "HTTP Method" },
  { value: "response.latency", label: "Latency (ms)" }
] as const;