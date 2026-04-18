import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";
import { InfoCardProps, ValueType } from "@/features/round-details/components/round-overview/info-card";

const DOMAIN_URL = process.env.NEXT_PUBLIC_NEXT_URL;
interface RoundOverviewData {
  roundOverview: InfoCardProps[];
}
const EXTERNAL_LINKS = {
  casino: (id: string) => `${DOMAIN_URL}/casinos/${id}`,
  user: (id: string) => `${DOMAIN_URL}/users/${id}`,
  round: (id: string) => `${DOMAIN_URL}/round-activity?roundId=${id}`,
};

const formatAmount = (amount: unknown): string =>
  new Intl.NumberFormat("en-US").format(Number(amount) || 0);

const safeString = (value: unknown): string =>
  (value ?? "").toString().trim();

const isValidErrorCode = (code: unknown) =>
  code !== null &&
  code !== undefined &&
  code !== "0" &&
  code !== "";

export default function generateRoundOverview(
  roundDetails?: RoundDetailsResponse | null
): RoundOverviewData {
  if (!roundDetails) {
    return { roundOverview: [] };
  }

  const { betInfo = [], tptInfo = [] } = roundDetails;

  const firstBet = betInfo[0];
  const firstTpt = tptInfo[0];

  const currency = firstBet?.currency_code || "-";

  const userId = safeString(firstBet?.user_id || firstTpt?.user_id);
  const roundId = safeString(firstBet?.round_id || firstTpt?.round_id);
  const casinoId = safeString(firstBet?.casino_id);

  const placedTxns = tptInfo.filter(txn => txn.action_type === "Placed");
  const settledTxns = tptInfo.filter(txn => txn.action_type === "Settled");

  const appendCurrencyInValueType = (value: ValueType[]): ValueType[] => {
    return [
      ...value,
      {
        label: currency,
        variant: "default",
      },
    ];
  };

  const betsPlacedItems: ValueType[] = placedTxns.map(txn => {
    const hasError = isValidErrorCode(txn.error_code);

    return {
      label: formatAmount(txn.amount),
      variant: hasError ? "error" : "success",
    };
  });

    const betsPlacedError: ValueType[] = (() => {
    const errors = settledTxns
      .filter(txn => isValidErrorCode(txn.error_code))
      .map(txn => ({
        label: txn.error_description,
        variant: "error" as const,
      }));

    return errors.length > 0
      ? errors
      : [
        {
          label: "OK",
          variant: "success",
        },
      ];
  })();


  const betsSettledItems: ValueType[] = settledTxns.map(txn => {
    const hasError = isValidErrorCode(txn.error_code);

    return {
      label: formatAmount(txn.amount),
      variant: hasError ? "error" : "success",
    };
  });

  const betsSettledError: ValueType[] = (() => {
    const errors = settledTxns
      .filter(txn => isValidErrorCode(txn.error_code))
      .map(txn => ({
        label: txn.error_description,
        variant: "error" as const,
      }));

    return errors.length > 0
      ? errors
      : [
        {
          label: "OK",
          variant: "success",
        },
      ];
  })();

  const settledTxn = settledTxns[0];

  const hasSettledError = Boolean(
    settledTxn &&
    settledTxn.status_code !== "0" &&
    isValidErrorCode(settledTxn.error_code)
  );

  const hasPlacedError = placedTxns.some(txn =>
    isValidErrorCode(txn.error_code)
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

  // -------------------------------
  // FINAL OUTPUT
  // -------------------------------
  const roundOverview: InfoCardProps[] = [
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
          value: firstBet?.casino_desc?.trim() || "N/A",
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
          ...createLink(roundId, EXTERNAL_LINKS.round),
        },
      ],
    },
    {
      iName: "coins",
      items: [
        {
          label: "Placed BETs",
          value: appendCurrencyInValueType(betsPlacedItems),
        },
        {
          label: "Error",
          value: betsPlacedError,
        },
      ],
    },
    {
      iName: "hand_coins",
      items: [
        {
          label: "Settled BETs",
          value: appendCurrencyInValueType(betsSettledItems),
        },
        {
          label: "Error",
          value: betsSettledError,
        },
      ],
      variant: transactionVariant,
    },
  ];

  return { roundOverview };
}