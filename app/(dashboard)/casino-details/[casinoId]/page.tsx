import { CasinoDetailsWrapper } from "@/features/casino-details/components/casino-details-wrapper";

// interface CasinoDetailsPageProps {
//   params: {
//     casinoId: string;
//   };
// }

// export default function Page({ params }: CasinoDetailsPageProps) {
//   return <CasinoDetailsWrapper initialCasinoId={params.casinoId} />;
// }

interface CasinoDetailsPageProps {
  params: Promise<{
    casinoId: string;
  }>;
}

export default async function Page({
  params,
}: CasinoDetailsPageProps) {
  const { casinoId } = await params;

  return (
    <CasinoDetailsWrapper
      initialCasinoId={casinoId}
    />
  );
}