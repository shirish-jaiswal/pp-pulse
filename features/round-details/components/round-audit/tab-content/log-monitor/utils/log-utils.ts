export const getDeepKeys = (obj: any, prefix = ""): string[] => {
  return Object.keys(obj || {}).reduce((res: string[], key) => {
    const name = prefix ? `${prefix}.${key}` : key;

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      return [...res, ...getDeepKeys(obj[key], name)];
    }

    return [...res, name];
  }, []);
};

export const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};