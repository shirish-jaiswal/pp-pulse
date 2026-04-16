'use client';

import {
  Building2,
  Coins,
  AlertCircle,
  Fingerprint,
  LucideIcon,
  Landmark
} from "lucide-react";

import InfoCard from "@/features/round-details/components/round-overview/info-card";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";

const ICON_MAP: Record<string, LucideIcon> = {
  building: Building2,
  coins: Coins,
  alert: AlertCircle,
  fingerprint: Fingerprint,
  landmark: Landmark,
};

const RoundOverview = () => {
  const { roundOverview } = useRoundDetails();

  if (!roundOverview || !Array.isArray(roundOverview)) return null;

  return (
    <div className="w-full border-border/50 bg-background/40">
      <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar">
        {roundOverview.map((section, idx) => {
          const IconComponent = section.iName
            ? ICON_MAP[section.iName]
            : null;

          return (
            <div key={idx} className="min-w-55 max-w-[320px] shrink-0">
              <InfoCard
                icon={IconComponent ?? undefined}
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