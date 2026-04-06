import {
    Building2,
    Coins,
    AlertCircle,
    Fingerprint,
} from "lucide-react";
import InfoCard from "@/features/round-details/components/round-overview/info-card";

const RoundOverview = () => {
    return (
        <div className="p-1 flex w-full flex-nowrap items-stretch gap-3 overflow-hidden">
            {/* 1. Casino Info - Default Variant */}
            <InfoCard
                icon={Building2}
                iconBgClass="bg-blue-50 text-blue-600 border border-blue-100"
                className="flex-[1.5] min-w-0"
                items={[
                    { label: "Casino Id", value: "ABC123DE456FG78H", copyable: true },
                    { label: "Casino Name", value: "Evolution Gaming International", copyable: true },
                ]}
            />

            {/* 2. User & Round Identifiers - Default Variant */}
            <InfoCard
                icon={Fingerprint}
                iconBgClass="bg-indigo-50 text-indigo-600 border border-indigo-100"
                className="flex-1 min-w-0"
                items={[
                    { label: "User ID", value: "USER_8822_X99J21", copyable: true },
                    {
                        label: "Round ID", value: "RX-990-22-KJ88-AL", copyable: true, link: {
                            href: "https://docs.your-api.com/errors/20620",
                            target: "_blank"
                        }
                    },
                ]}
            />

            {/* 3. Financial Info - Success Variant */}
            <InfoCard
                icon={Coins}
                iconBgClass="bg-amber-50 text-amber-600 border border-amber-100"
                className="flex-1 min-w-0"
                items={[
                    { label: "Currency", value: "USD ($)" },
                    { label: "Total BET", value: "150.00" },
                ]}
            />

            {/* 4. Alert/Status - Error Variant with Link */}
            <InfoCard
                variant="error"
                icon={AlertCircle}
                iconBgClass="bg-red-50 text-red-600 border border-red-100"
                className="flex-[1.2] min-w-0"
                items={[
                    {
                        label: "Status Message",
                        value: "Bet was refunded (20620)",
                    },
                ]}
            />
        </div>
    );
};

export default RoundOverview;