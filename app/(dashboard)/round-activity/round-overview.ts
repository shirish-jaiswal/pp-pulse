import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";
import { InfoCardProps, ValueType } from "@/features/round-details/components/round-overview/info-card";

export interface RoundOverviewData {
  roundOverview: InfoCardProps[];
}

const EXTERNAL_LINKS = {
  casino: (id: string) => `/casino-details/?casinoId=${id}`,
  user: (id: string) => `/user-management?userId=${id}`,
  round: (id: string) => `/round-activity?roundId=${id}`,
};

const formatAmount = (amount: unknown): string =>
  new Intl.NumberFormat("en-US").format(Number(amount) || 0);

const safeString = (value: unknown): string =>
  (value ?? "").toString().trim();

const isValidErrorCode = (code: unknown) =>
  code !== null && code !== undefined && code !== "0" && code !== "";

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
    icon: icon,
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

export default function generateRoundOverview(
  roundDetails?: RoundDetailsResponse | null
): RoundOverviewData {
  if (!roundDetails) return { roundOverview: [] };

  const { betInfo = [], tptInfo = [] } = roundDetails;

  if (!hasValidData(betInfo) && !hasValidData(tptInfo)) {
    return { roundOverview: [] };
  }

  const firstBet = betInfo[0] ?? {};
  const firstTpt = tptInfo[0] ?? {};

  const currency = firstTpt?.currency_code || "-";

  const userId = safeString(firstBet?.user_id || firstTpt?.user_id);
  const roundId = safeString(firstBet?.round_id || firstTpt?.round_id);
  const casinoId = safeString(firstBet?.casino_id || firstTpt?.casino_id);
  const casinoName = safeString(firstBet?.casino_desc || firstTpt?.casino_name);
  const walletType = safeString(firstTpt?.Wallet_Type || "NA");

  // Group transactions
  const placedTxns = tptInfo.filter(txn => txn.action_type === "Placed");
  const settledTxns = tptInfo.filter(txn => txn.action_type === "Settled");
  const unknownTxns = tptInfo.filter(txn => txn.action_type === "Unknown");
  const cancelledTxns = tptInfo.filter(txn => txn.action_type === "Cancelled");
  const adjustedTxns = tptInfo.filter(txn => txn.action_type === "Adjusted");

  const hasPlacedError = placedTxns.some(txn => isValidErrorCode(txn.error_code));
  const settledTxn = settledTxns[0];
  const hasSettledError = Boolean(
    `settledTxn && settledTxn.status_code !== "0" && isValidErrorCode(settledTxn.error_code)`
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
  const hasCancelledError = cancelledTxns.some(txn => isValidErrorCode(txn.error_code));
  const cancelledVariant: InfoCardProps["variant"] = hasCancelledError ? "error" : "default";

  const hasAdjusted = adjustedTxns.length > 0;
  const hasAdjustedError = adjustedTxns.some(txn => isValidErrorCode(txn.error_code));
  const adjustedVariant: InfoCardProps["variant"] = hasAdjustedError ? "error" : "info";

  // -----------------------------------------------------------------
  // Resilient Balance Boundary Evaluation Logic
  // -----------------------------------------------------------------
  let balanceSection: InfoCardProps | null = null;

  if (hasValidData(tptInfo)) {
    const sortedTpt = [...tptInfo].sort(
      (a, b) => new Date(a.trans_date).getTime() - new Date(b.trans_date).getTime()
    );

    const totalRecords = sortedTpt.length;
    let initialBalance = sortedTpt[0].balance_before;
    let finalBalance = sortedTpt[totalRecords - 1].balance_after;

    // DEFENSIVE EDGE-CASE FIX: Handle lazily zeroed-out webhook logs
    if (initialBalance === 0 && finalBalance === 0) {
      const lastValidStateRow = [...sortedTpt].reverse().find(
        (tx) => (Number(tx.balance_after) || 0) > 0 || (Number(tx.balance_before) || 0) > 0
      );

      if (lastValidStateRow) {
        const brokenTx = sortedTpt[totalRecords - 1];
        initialBalance = lastValidStateRow.balance_before;

        // Reconstruct true state if the absolute last record dropped uncalculated data
        if (brokenTx.action_type === "Cancelled" || brokenTx.action_type === "Settled") {
          finalBalance = lastValidStateRow.balance_after + (Number(brokenTx.amount) || 0);
        } else if (brokenTx.action_type === "Placed") {
          finalBalance = lastValidStateRow.balance_after - (Number(brokenTx.amount) || 0);
        } else {
          finalBalance = lastValidStateRow.balance_after;
        }
      }
    }

    const delta = finalBalance - initialBalance;

    balanceSection = {
      icon: "wallet",
      isIconButton: false,
      variant: delta >= 0 ? "success" : "default",
      items: [
        {
          label: "Initial Balance",
          value: appendCurrency([{ label: formatAmount(initialBalance), variant: "default" }], currency),
        },
        {
          label: "Final Balance",
          value: appendCurrency([{ label: formatAmount(finalBalance), variant: "default" }], currency),
        },
        {
          label: "Net Change",
          value: [{ 
            label: `${delta >= 0 ? "+" : ""}${formatAmount(delta)}`, 
            variant: delta >= 0 ? "success" : "error" 
          }],
        },
      ],
    };
  }

  const sections: (InfoCardProps | null)[] = [
    {
      icon: walletType, 
      variant: walletType.toLocaleLowerCase() === "sw" ? "success" : walletType === "bt" ? "info" : "default",
      isIconButton: true,
      items: [
        {
          label: "Casino Id",
          value: casinoId || "N/A",
          ...createLink(casinoId, EXTERNAL_LINKS.casino),
        },
        {
          label: "Casino Name",
          value: casinoName || "N/A",
          ...createLink(casinoId, EXTERNAL_LINKS.casino),
        },
      ],
    },
    {
      icon: "fingerprint",
      isIconButton: true,
      items: [
        {
          label: "User ID",
          value: userId || "N/A",
          ...createLink(userId, EXTERNAL_LINKS.user),
        },
        {
          label: "Round ID",
          value: roundId || "N/A",
          ...createLink(roundId, EXTERNAL_LINKS.round),
        },
      ],
    },
    balanceSection,
    buildTxnSection("Placed BETs", "coins", placedTxns, currency),
    buildTxnSection("Settled BETs", "hand_coins", settledTxns, currency, transactionVariant),
    buildTxnSection("Unknown BETs", "coins", unknownTxns, currency),
    buildTxnSection("Cancelled BETs", "alert", cancelledTxns, currency, cancelledVariant),
    buildTxnSection("Adjusted BETs", "alert", adjustedTxns, currency, adjustedVariant),
  ];

  return {
    roundOverview: sections.filter(Boolean) as InfoCardProps[],
  };
}