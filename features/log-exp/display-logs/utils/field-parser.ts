// src/utils/field-parser.ts

/**
 * Recursively flattens a deep JSON object structure into dot-notation string paths.
 * (e.g., { agent: { name: "gs11" } } becomes "agent.name")
 */
function extractDeepKeys(obj: any, prefix = ""): string[] {
  if (!obj || typeof obj !== "object") return [];
  if (Array.isArray(obj)) return []; // Skips arrays to match standard Kibana field indexing

  return Object.keys(obj).reduce((acc: string[], key: string) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    // If the child is an object and not an array, recursive drill down
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      acc.push(...extractDeepKeys(obj[key], currentPath));
    } else {
      // Leaf node reached, push path string
      acc.push(currentPath);
    }
    return acc;
  }, []);
}

/**
 * Iterates across all search hits returned by Elasticsearch/Kibana
 * to compile a completely unique list of indexable attributes.
 */
export function extractUniqueFields(hits: any[]): string[] {
  const uniqueFields = new Set<string>();

  hits.forEach((hit) => {
    // 1. Capture root metadata wrapper attributes (like _index, _id, _score)
    Object.keys(hit).forEach((rootKey) => {
      if (rootKey !== "_source" && rootKey !== "sort") {
        uniqueFields.add(rootKey);
      }
    });

    // 2. Extract nested payload attributes from inside the _source wrapper
    if (hit._source) {
      const sourceKeys = extractDeepKeys(hit._source);
      sourceKeys.forEach((path) => uniqueFields.add(path));
    }
  });

  // Sort alphabetically to present neat, organized sidebars matching Kibana
  return Array.from(uniqueFields).sort();
}