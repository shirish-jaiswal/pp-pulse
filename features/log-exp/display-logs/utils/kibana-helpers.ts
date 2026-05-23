// utils/kibana-helpers.ts

export function getFieldValue(hit: any, path: string): string {
  if (path in hit) {
    return String(hit[path] ?? "-");
  }

  const parts = path.split(".");
  let current = hit._source;

  for (const part of parts) {
    if (current === null || current === undefined) return "-";
    current = current[part];
  }

  if (typeof current === "object" && current !== null) {
    return JSON.stringify(current);
  }

  return current !== undefined && current !== null ? String(current) : "-";
}

export function flattenObject(obj: any, prefix = ""): Record<string, string> {
  let results: Record<string, string> = {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(results, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      results[newKey] = JSON.stringify(value);
    } else {
      results[newKey] = value !== null && value !== undefined ? String(value) : "-";
    }
  }

  return results;
}