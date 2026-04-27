import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";
import { InfoCardProps, ValueType } from "@/features/round-details/components/round-overview/info-card";

const DOMAIN_URL = process.env.NEXT_PUBLIC_NEXT_URL;

export interface RoundOverviewData {
  roundOverview: InfoCardProps[];
}

const EXTERNAL_LINKS = {
  casino: (id: string) => `${DOMAIN_URL}/casinos/${id}`,
  user: (id: string) => `${DOMAIN_URL}/users/${id}`,
  round: (id: string) => `${DOMAIN_URL}/round-activity?roundId=${id}`,
};

// ------------------
// Helpers
// ------------------
const formatAmount = (amount: unknown): string =>
  new Intl.NumberFormat("en-US").format(Number(amount) || 0);

const safeString = (value: unknown): string =>
  (value ?? "").toString().trim();

const isValidErrorCode = (code: unknown) =>
  code !== null && code !== undefined && code !== "0" && code !== "";

const isEmptyArray = (arr: unknown) =>
  !Array.isArray(arr) || arr.length === 0;

const hasValidData = (arr: any[]) =>
  Array.isArray(arr) &&
  arr.length > 0 &&
  arr.some(item => Object.keys(item || {}).length > 0);

const createLink = (
  id: string,
  url: (id: string) => string
): Pick<InfoCardProps["items"][number], "link" | "copyable"> | {} =>
  id
    ? {
        link: {
          href: url(id),
          target: "_blank",
        },
        copyable: true,
      }
    : {};

const appendCurrency = (values: ValueType[], currency: string): ValueType[] => [
  ...values,
  { label: currency, variant: "default" },
];

const mapTxnValues = (txns: any[]): ValueType[] =>
  txns.map(txn => ({
    label: formatAmount(txn.amount),
    variant: isValidErrorCode(txn.error_code) ? "error" : "success",
  }));

const mapTxnErrors = (txns: any[]): ValueType[] => {
  const errors = txns
    .filter(txn => isValidErrorCode(txn.error_code))
    .map(txn => ({
      label: txn.error_description,
      variant: "error" as const,
    }));

  return errors.length > 0
    ? errors
    : txns.length > 0
    ? [{ label: "OK", variant: "success" }]
    : [];
};

const buildTxnSection = (
  title: string,
  icon: string,
  txns: any[],
  currency: string,
  variant?: InfoCardProps["variant"]
): InfoCardProps | null => {
  if (txns.length === 0) return null;

  return {
    iName: icon,
    items: [
      {
        label: title,
        value: appendCurrency(mapTxnValues(txns), currency),
      },
      {
        label: "Error",
        value: mapTxnErrors(txns),
      },
    ],
    ...(variant ? { variant } : {}),
  };
};

// ------------------
// Main Function
// ------------------
export default function generateRoundOverview(
  roundDetails?: RoundDetailsResponse | null
): RoundOverviewData {
  if (!roundDetails) return { roundOverview: [] };

  const { betInfo = [], tptInfo = [] } = roundDetails;

  // 🚨 Early exit
  if (!hasValidData(betInfo) && !hasValidData(tptInfo)) {
    return { roundOverview: [] };
  }

  const firstBet = betInfo[0] ?? {};
  const firstTpt = tptInfo[0] ?? {};

  const currency = firstTpt?.currency_code || "-";

  const userId = safeString(firstTpt?.user_id || firstTpt?.user_id);
  const roundId = safeString(firstTpt?.round_id || firstTpt?.round_id);
  const casinoId = safeString(firstTpt?.casino_id);

  // Group transactions
  const placedTxns = tptInfo.filter(txn => txn.action_type === "Placed");
  const settledTxns = tptInfo.filter(txn => txn.action_type === "Settled");
  const unknownTxns = tptInfo.filter(txn => txn.action_type === "Unknown");
  const cancelledTxns = tptInfo.filter(txn => txn.action_type === "Cancelled");

  // Status logic
  const hasPlacedError = placedTxns.some(txn =>
    isValidErrorCode(txn.error_code)
  );

  const settledTxn = settledTxns[0];
  const hasSettledError = Boolean(
    settledTxn &&
      settledTxn.status_code !== "0" &&
      isValidErrorCode(settledTxn.error_code)
  );

  const isSettled = settledTxns.length > 0;

  const transactionVariant: InfoCardProps["variant"] =
    hasPlacedError
      ? "error"
      : !isSettled
      ? "default"
      : hasSettledError
      ? "error"
      : "success";

  const hasCancelled = cancelledTxns.length > 0;
  const hasCancelledError = cancelledTxns.some(txn =>
    isValidErrorCode(txn.error_code)
  );
  const cancelledVariant: InfoCardProps["variant"] =
    hasCancelledError ? "error" : "default";

  // ------------------
  // Build Sections
  // ------------------
  const sections: (InfoCardProps | null)[] = [
    {
      iName: "landmark",
      items: [
        {
          label: "Casino Id",
          value: casinoId || "N/A",
          ...createLink(casinoId, EXTERNAL_LINKS.casino),
        },
        {
          label: "Casino Name",
          value: firstBet?.casino_desc?.trim() + " - " + firstTpt.Wallet_Type || "N/A",
          ...createLink(casinoId, EXTERNAL_LINKS.casino),
        },
      ],
    },
    {
      iName: "fingerprint",
      items: [
        {
          label: "User ID",
          value: userId || "N/A",
          ...createLink(userId, EXTERNAL_LINKS.user),
        },
        {
          label: "Round ID",
          value: roundId || "N/A",
          copyable: true,
        },
      ],
    },
    buildTxnSection("Placed BETs", "coins", placedTxns, currency),
    buildTxnSection(
      "Settled BETs",
      "hand_coins",
      settledTxns,
      currency,
      transactionVariant
    ),
    buildTxnSection("Unknown BETs", "coins", unknownTxns, currency),
    buildTxnSection("Cancelled BETs", "alert", cancelledTxns, currency, cancelledVariant),
  ];

  return {
    roundOverview: sections.filter(Boolean) as InfoCardProps[],
  };
}
