export const getDeepKeys = (obj: any, prefix = ""): string[] => {
  const result: string[] = [];

  if (
    typeof obj !== "object" ||
    obj === null ||
    Array.isArray(obj)
  ) {
    return result;
  }

  for (const key of Object.keys(obj)) {
    const name = prefix ? `${prefix}.${key}` : key;
    let value = obj[key];

    result.push(name); // ✅ ALWAYS include parent

    // ✅ Try parsing JSON strings
    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch {}
    }

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      result.push(...getDeepKeys(value, name));
    }
  }

  return result;
};
export const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => {
    if (acc == null) return undefined;
    return acc[part];
  }, obj);
};