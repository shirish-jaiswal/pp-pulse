export const EXTERNAL_LINKS = {
 "contextMap.casinoId": (id: string) => `/portal/casino-details?casinoId=${id}`,
  "contextMap.userId": (id: string) => `/portal/user-management?userId=${id}`,
  "contextMap.roundId": (id: string) => `/portal/round-activity?roundId=${id}`,
  "contextMap.playerId": (id: string) => `/portal/user-management?playerId=${id}`
} as const;

export type LinkableField = keyof typeof EXTERNAL_LINKS;

export const hasExternalLink = (field: string): field is LinkableField => {
  return field in EXTERNAL_LINKS;
};