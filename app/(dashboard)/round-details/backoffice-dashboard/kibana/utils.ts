export const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
  return Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

export const getDeepValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const getServiceName = (index: string) =>
  index.replace(/^filebeat-/, "").replace(/-\d{4}\.\d{2}\.\d{2}(-\d{6})?$/, "");