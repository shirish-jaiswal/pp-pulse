import { searchArticlesKeys } from "@/lib/excel-engine/excel-db-keys/knowledge-boost/search-articles";
import { searchArticles } from "@/lib/excel-engine/knowledge-base/articles/search-articles";
import { useQuery } from "@tanstack/react-query";


export default function useSearchArticles(
  keywords: string[],
  initialData?: any
) {
  const isEnabled = Array.isArray(keywords) && keywords.length > 0 && keywords.some(k => !!k.trim());

  const targetColumns = ["seo_title", "seo_description"];

  return useQuery<any, Error>({
    queryKey: searchArticlesKeys.list(keywords, targetColumns),

    queryFn: () => searchArticles(keywords),

    enabled: isEnabled,

    initialData,
    staleTime: 1000 * 60 * 5, 
    placeholderData: (prev: any) => prev,
  });
}