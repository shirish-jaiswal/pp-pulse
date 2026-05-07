import { Suspense } from "react";
import { CasinoDetailsWrapper } from "@/features/casino-details/components/casino-details-wrapper";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <CasinoDetailsWrapper />
        </Suspense>
    );
}
