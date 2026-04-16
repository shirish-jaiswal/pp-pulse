import { RoundDetailsResponse } from "@/app/(dashboard)/round-activity/page";
import { InfoCardProps } from "@/features/round-details/components/round-overview/info-card";

interface RoundOverviewData {
  roundOverview: InfoCardProps[];
}

const EXTERNAL_LINKS = {
  casino: (id: string) => `https://casino.pp.com/casinos/${id}`,
  user: (id: string) => `https://casino.pp.com/users/${id}`,
  round: (id: string) => `https://casino.pp.com/rounds/${id}`,
};

export default function generateRoundOverview(
  roundDetails: RoundDetailsResponse | null | undefined
): RoundOverviewData {
  if (!roundDetails) {
    return { roundOverview: [] };
  }

  const { betInfo = [], tptInfo = [] } = roundDetails;

  const firstBet = betInfo[0];
  const firstTpt = tptInfo[0];

  const userId = (firstBet?.user_id || firstTpt?.user_id || "").toString().trim();
  const roundId = (firstBet?.round_id || firstTpt?.round_id || "").toString().trim();
  const casinoId = firstBet?.casino_id?.toString().trim() || "";

  const totalBetAmount = betInfo.reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);

  const rawCurrency = (firstBet?.currency_code || firstTpt?.currency_code || "N/A").trim();
  const currencyDisplay = rawCurrency.toUpperCase() === "USD" ? "USD ($)" : rawCurrency;

  const roundOverview: InfoCardProps[] = [
    {
      iName: "landmark",
      items: [
        {
          label: "Casino Id",
          value: casinoId || "N/A",
          ...(casinoId && {
            link: { href: EXTERNAL_LINKS.casino(casinoId), target: "_blank" },
            copyable: true,
          }),
        },
        {
          label: "Casino Name",
          value: firstBet?.casino_desc?.trim() || "N/A",
          ...(casinoId && {
            link: { href: EXTERNAL_LINKS.casino(casinoId), target: "_blank" },
            copyable: true,
          }),
        },
      ],
    },
    {
      iName: "fingerprint",
      items: [
        {
          label: "User ID",
          value: userId || "N/A",
          ...(userId && {
            link: { href: EXTERNAL_LINKS.user(userId), target: "_blank" },
            copyable: true,
          }),
        },
        {
          label: "Round ID",
          value: roundId || "N/A",
          ...(roundId && {
            link: { href: EXTERNAL_LINKS.round(roundId), target: "_blank" },
            copyable: true,
          }),
        },
      ],
    },
    {
      iName: "coins",
      items: [
        {
          label: "Currency",
          value: currencyDisplay,
        },
        {
          label: "Total BET",
          value: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalBetAmount),
        },
      ],
    },
  ];

  return { roundOverview };
}