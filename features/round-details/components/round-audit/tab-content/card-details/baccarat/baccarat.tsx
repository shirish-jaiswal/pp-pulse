import { MiniPlayingCard, Rank, Suit } from '@/components/custom/games/playing-card';
import { useRoundDetails } from '@/features/round-details/context/round-details-context';
import { CardDetailsInfo } from '@/features/round-details/types/card-details';
import { useFindBaccaratCards } from '@/hooks/excel-db/use-baccarat-cards';
import React, { useEffect, useMemo } from 'react';

interface BaccaratHandReportProps {
  events?: CardDetailsInfo;
}

const BaccaratHandReport: React.FC<BaccaratHandReportProps> = ({ events = [] }) => {
const {roundDetails, setRoundDetails} = useRoundDetails();
  const resultCodes = useMemo(() => {
    if (!events || !Array.isArray(events)) return [];
    return events.map((e) => e.resultcode_id).filter(Boolean);
  }, [events]);

  const { data: cardDetails, isLoading, error } = useFindBaccaratCards({
    code: resultCodes,
  });

  const calculateScore = (codes: string[]) => {
    if (!cardDetails) return 0;
    const total = codes.reduce((acc, code) => {
      const card = cardDetails.find((c: any) => c.code === code);
      if (!card) return acc;
      const rank = String(card.rank);
      if (rank === 'A') return acc + 1;
      if (['10', 'J', 'Q', 'K', '0'].includes(rank)) return acc + 0;
      return acc + (parseInt(rank) || 0);
    }, 0);
    return total % 10;
  };

  if (!events || events.length === 0) {
    return (
      <div className="p-4 bg-slate-50 text-slate-500 text-xs font-medium">
        No card events found for this session.
      </div>
    );
  }

  const playerCodes = events
    .filter(e => e.event_type.includes("PLAYER") || e.state_indicator === 1)
    .map(e => e.resultcode_id);

  const bankerCodes = events
    .filter(e => e.event_type.includes("CARD_DEALT") && e.state_indicator === 0)
    .map(e => e.resultcode_id);

  const playerScore = calculateScore(playerCodes);
  const bankerScore = calculateScore(bankerCodes);
  const isTie = playerScore === bankerScore;

  const CardSection = ({ title, codes, score, accentColor, isWinner }: any) => (
    <div className={`flex-1 border rounded bg-white p-3 ${isWinner ? 'border-slate-400 bg-slate-50/50' : 'border-slate-200'}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-4 ${accentColor}`} />
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{title}</span>
          {isWinner && <span className="text-[10px] font-bold text-slate-500">[WINNER]</span>}
        </div>
        <div className="text-xs font-mono bg-white border px-2 py-0.5 rounded shadow-sm">
          Score: <span className="font-bold">{score}</span>
        </div>
      </div>

      <div className="flex gap-3 h-20 items-center">
        {codes.map((code: string, index: number) => {
          const card = cardDetails?.find((c: any) => c.code === code);
          const isThird = index === 2;
          return card ? (
            <div key={`${code}-${index}`} className="relative group">
              <div className={isThird ? 'rotate-90 scale-90' : ''}>
                <MiniPlayingCard rank={card.rank as Rank} suit={card.suit as Suit} size={55} />
              </div>
              {isThird && (
                <span className="absolute -top-3 left-0 w-full text-center text-[8px] text-slate-400 font-bold uppercase">3rd</span>
              )}
            </div>
          ) : (
            <div key={index} className="w-10 h-14 bg-slate-100 border border-slate-200 rounded" />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 font-sans text-slate-800">
      {/* Main Hand Comparison */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isLoading ? (
          <div className="w-full p-6 text-center text-xs text-slate-400 bg-slate-50">
            Loading card data...
          </div>
        ) : (
          <>
            <CardSection
              title="Player"
              codes={playerCodes}
              score={playerScore}
              accentColor="bg-blue-600"
              isWinner={playerScore > bankerScore}
            />
            <CardSection
              title="Banker"
              codes={bankerCodes}
              score={bankerScore}
              accentColor="bg-red-600"
              isWinner={bankerScore > playerScore}
            />
          </>
        )}
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between p-3 bg-slate-50 border rounded text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Result:</span>
          <span className={isTie ? 'text-slate-700' : playerScore > bankerScore ? 'text-blue-700' : 'text-red-700'}>
            {isTie ? "TIE" : playerScore > bankerScore ? "PLAYER HAND WIN" : "BANKER HAND WIN"}
          </span>
        </div>
        {isTie && <span className="text-slate-500 border-l pl-3 ml-3 border-slate-200">Payout 8:1</span>}
      </div>
    </div>
  );
};

export default BaccaratHandReport;