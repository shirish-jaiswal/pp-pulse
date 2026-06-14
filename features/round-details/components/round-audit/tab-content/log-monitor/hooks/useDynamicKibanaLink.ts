import { useMemo } from "react";
import { useFindStoredQueries } from "@/hooks/excel-db/use-find-stored-queries";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { getGameType } from "@/utils/get-game-type";
import { generateKibanaUrl, formatKqlValue } from "@/utils/kibana-link-generator";

interface UseDynamicKibanaLinkProps {
  logType: "platform" | "game";
}

export function useDynamicKibanaLink({ logType }: UseDynamicKibanaLinkProps) {
  const { roundDetails, gameMetadata, multiIds } = useRoundDetails();

  const searchKeyword = useMemo(() => {
    if (logType === "platform") return "Slots Log";
    if (logType === "game") {
      const dynamicType = roundDetails?.gameDetails?.at(0)?.game_type;
      if (dynamicType) return getGameType(dynamicType);
    }
    return "";
  }, [logType, roundDetails?.gameDetails]);

  const { data: templates, isLoading } = useFindStoredQueries({
    keywords: searchKeyword ? [searchKeyword] : [],
    enabled: !!searchKeyword,
  });

  const activeTemplate = templates?.[0] || null;

  // Formatting arrays directly
  const formatArray = (arr: string[] | undefined, fallback?: string): string => {
    if (arr && arr.length > 0) return formatKqlValue(arr.join(","));
    return fallback || "";
  };

  const generatedUrl = useMemo(() => {
    if (!activeTemplate) return "";

    const singleRoundId = (roundDetails?.tptInfo?.at(0)?.round_id || "") as string;
    const singleGameId = (roundDetails?.tptInfo?.at(0)?.game_id || "") as string;
    const singleUserId = (roundDetails?.tptInfo?.at(0)?.user_id || "") as string;

    const mappings: Record<string, string> = {
      round_id: formatArray(multiIds?.round_ids, singleRoundId),
      game_id: formatArray(multiIds?.game_ids, singleGameId),
      user_id: singleUserId,
    };

    const transDateStr = roundDetails?.tptInfo?.at(0)?.trans_date;
    let timeFromValue = "now-24h%2Fh";
    let timeToValue = "now";

    if (transDateStr) {
      const baseTimestamp = new Date(transDateStr).getTime();
      if (!isNaN(baseTimestamp)) {
        timeFromValue = `'${new Date(baseTimestamp - 20 * 60 * 1000).toISOString()}'`;
        timeToValue = `'${new Date(baseTimestamp + 24 * 60 * 60 * 1000).toISOString()}'`;
      }
    }

    const sortDir = logType === "platform" ? "desc" : "asc";

    const url = generateKibanaUrl({
      template: activeTemplate,
      replacements: mappings,
      timeFrom: timeFromValue,
      timeTo: timeToValue,
      sortDirection: sortDir
    });

    console.group(`[Kibana Compiler] Log Type: ${logType}`);
    console.log("Mappings:", mappings);
    console.log("Generated URL:", url);
    console.groupEnd();

    return url;
  }, [activeTemplate, multiIds, roundDetails, logType]);

  return {
    url: generatedUrl,
    isLoading: isLoading && !!searchKeyword,
    hasTemplate: !!activeTemplate,
    templateTitle: activeTemplate?.title || "",
  };
}