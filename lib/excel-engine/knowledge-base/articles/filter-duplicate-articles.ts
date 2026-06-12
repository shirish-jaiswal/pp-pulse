/**
 * Filters out items from an incoming array that already exist in the database sheet.
 */
export function filterDuplicateArticles(
  existingRows: any[], 
  incomingArticles: any[]
): any[] {
  // Create a fast lookup Set of numbers from the current Excel table entries
  const existingIds = new Set<number>(
    existingRows.map((row) => Number(row.article_id)).filter(Boolean)
  );

  // Return only the items that do not exist yet in the database
  return incomingArticles.filter((article) => !existingIds.has(Number(article.id)));
}