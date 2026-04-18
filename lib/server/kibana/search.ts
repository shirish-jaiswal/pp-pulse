import axios from "axios";
import { EsSortValue } from "@/types/kibana";

export const MATCH_PHRASE_OPTIONS = [
    "@timestamp",
  "message",
  "host.name",
  "contextMap.userId",
  "contextMap.ppenv",
  "log.offset",
  "servicename",
  "agent.type",
  "app.requestLog.log",
  "app.responseLog.log",
  "app.serviceMethod",
  "app.url"
] as const;
export type SortType = "asc" | "desc";
export type MatchPhraseField = typeof MATCH_PHRASE_OPTIONS[number];
export type MatchPhraseData = {
    key: string,
    value: string,
    isPositive: boolean,
    isDisabled: boolean,
    and?: MatchPhraseData,
    or?: MatchPhraseData
}
export interface LogRequestParams {
  index: string;
  query: string;                    // The string from search bar: "((A OR B) AND NOT C)"
  startDate: string;                // ISO Date
  endDate: string;                  // ISO Date
  sort: SortType;                   // Sort order for @timestamp
  fields?: string[];                // Specific fields to return
  size?: number;                    // Page size (default 500)
  searchAfter?: EsSortValue[];      // Pagination token from previous response
  trackTotalHits?: boolean;         // Get exact counts > 10,000
  matchPhrase?: MatchPhraseData[];  // Structured pill-filters
}

export async function c_getKibanaLogs(data: LogRequestParams) {
    const combinedCookie = ["", ""].join("; ");

    try {
        const response = await axios.post(`/api/kibana`, data, {
            params: {
                cookie : combinedCookie,
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Response :: ", response.data.data);
        return response.data.data;

    } catch (error: any) {
        console.log("==========================================================================================")
        console.log(error)
        console.log("==========================================================================================")
        const errorMessage = error.response?.data?.error || "Failed to fetch transaction info";
        throw new Error(errorMessage);
    }
}