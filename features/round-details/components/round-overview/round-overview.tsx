'use client';

import {
  Building2,
  Coins,
  AlertCircle,
  Fingerprint,
  LucideIcon,
  Landmark,
  HandCoinsIcon,
  WalletIcon
} from "lucide-react";

import InfoCard from "@/features/round-details/components/round-overview/info-card";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";

const ICON_MAP: Record<string, LucideIcon> = {
  wallet: WalletIcon,
  building: Building2,
  coins: Coins,
  alert: AlertCircle,
  fingerprint: Fingerprint,
  landmark: Landmark,
  hand_coins: HandCoinsIcon
};

const RoundOverview = () => {
  const { roundOverview } = useRoundDetails();

  if (!roundOverview || !Array.isArray(roundOverview)) return null;

  return (
    <div className="w-full border-border/50 bg-background/40">
      <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar">
        {roundOverview.map((section: any, idx) => {
          // 1. Unify incoming data property from both your manual maps and helper functions
          const rawIcon = section.icon || section.iName;

          // 2. Resolve the value: 
          // If it matches a key in our Lucide map, extract the React Component.
          // If it doesn't match (like "Seamless" or "SW"), keep it as a raw string.
          const resolvedIcon = (typeof rawIcon === "string" && ICON_MAP[rawIcon])
            ? ICON_MAP[rawIcon]
            : rawIcon;

          return (
            <div key={idx} className="min-w-28 max-w-[320px] shrink-0">
              <InfoCard
                icon={resolvedIcon}
                className="h-full"
                variant={section.variant || "default"}
                items={section.items}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoundOverview;