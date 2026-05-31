export const getDeepKeys = (obj: any, prefix = ""): string[] => {
  const result: string[] = [];

  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return result;
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      result.push(...getDeepKeys(value, path));
    } else {
      result.push(path);
    }
  }

  return result;
};

export const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return undefined;

  const parts = path.split(".");

  // direct
  let direct = parts.reduce((acc, p) => acc?.[p], obj);
  if (direct !== undefined) return direct;

  // fallback raw
  let raw = parts.reduce((acc, p) => acc?.[p], obj?.raw);
  if (raw !== undefined) return raw;

  // fallback app
  let app = parts.reduce((acc, p) => acc?.[p], obj?.app);
  if (app !== undefined) return app;

  return undefined;
};