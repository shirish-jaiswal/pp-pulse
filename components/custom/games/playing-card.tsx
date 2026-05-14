interface CardProps {
  rank: Rank;
  suit?: Suit;
  size?: number;
  rotate?: 0 | 90 | 180 | 270;
}

export type Suit = "H" | "D" | "S" | "C";
export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "JKR";

export const CARD_COLORS = {
  RED: "#ef4444",
  DARK: "#1e293b",
  BORDER: "#10181f",
  BG_MUTED: "#f8fafc"
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  H: "♥",
  D: "♦",
  S: "♠",
  C: "♣"
};

export const PIP_MAP: Record<
  string,
  { x: number; y: number; flip?: boolean }[]
> = {
  "2": [{ x: 50, y: 25 }, { x: 50, y: 75, flip: true }],
  "3": [
    { x: 50, y: 25 },
    { x: 50, y: 50 },
    { x: 50, y: 75, flip: true }
  ],
  "4": [
    { x: 30, y: 25 },
    { x: 70, y: 25 },
    { x: 30, y: 75, flip: true },
    { x: 70, y: 75, flip: true }
  ],
  "5": [
    { x: 30, y: 25 },
    { x: 70, y: 25 },
    { x: 50, y: 50 },
    { x: 30, y: 75, flip: true },
    { x: 70, y: 75, flip: true }
  ],
  "6": [
    { x: 30, y: 25 },
    { x: 70, y: 25 },
    { x: 30, y: 50 },
    { x: 70, y: 50 },
    { x: 30, y: 75, flip: true },
    { x: 70, y: 75, flip: true }
  ],
  "7": [
    { x: 30, y: 25 },
    { x: 70, y: 25 },
    { x: 30, y: 50 },
    { x: 70, y: 50 },
    { x: 50, y: 37.5 },
    { x: 30, y: 75, flip: true },
    { x: 70, y: 75, flip: true }
  ],
  "8": [
    { x: 30, y: 25 },
    { x: 70, y: 25 },
    { x: 30, y: 50 },
    { x: 70, y: 50 },
    { x: 50, y: 37.5 },
    { x: 50, y: 62.5, flip: true },
    { x: 30, y: 75, flip: true },
    { x: 70, y: 75, flip: true }
  ],
  "9": [
    { x: 30, y: 20 },
    { x: 70, y: 20 },
    { x: 30, y: 40 },
    { x: 70, y: 40 },
    { x: 50, y: 50 },
    { x: 30, y: 60, flip: true },
    { x: 70, y: 60, flip: true },
    { x: 30, y: 80, flip: true },
    { x: 70, y: 80, flip: true }
  ],
  "10": [
    { x: 30, y: 20 },
    { x: 70, y: 20 },
    { x: 30, y: 40 },
    { x: 70, y: 40 },
    { x: 50, y: 30 },
    { x: 50, y: 70, flip: true },
    { x: 30, y: 60, flip: true },
    { x: 70, y: 60, flip: true },
    { x: 30, y: 80, flip: true },
    { x: 70, y: 80, flip: true }
  ]
};

const getRotation = (r: number) => r;

const getCardColor = (suit: Suit = "S", rank: Rank) =>
  rank === "JKR"
    ? "#8b5cf6"
    : suit === "H" || suit === "D"
      ? CARD_COLORS.RED
      : CARD_COLORS.DARK;

/* =========================================================
   MINI CARD
========================================================= */
export type ApiRank = Rank | 1;
const normalizeRank = (rank: ApiRank): Rank => {
  if (rank === 1) return "A";
  return rank as Rank;
};
export const MiniPlayingCard = ({
  rank,
  suit = "S",
  size = 60,
  rotate = 0
}: CardProps & { rank: ApiRank }) => {

  const normalizedRank = normalizeRank(rank);

  const color = getCardColor(suit, normalizedRank);
  const width = size;
  const height = size * 1.4;

  const rankFontSize = normalizedRank === "10" ? "36" : "42";

  return (
    <svg width={width} height={height} viewBox="0 0 80 112">
      <g transform={rotate ? `rotate(${rotate}, 40, 56)` : undefined}>
        <rect width="80" height="112" rx="8" fill="white" stroke={CARD_COLORS.BORDER} />

        <g fill={color} textAnchor="middle" fontWeight="900">
          <text x="40" y="54" fontSize={rankFontSize}>
            {normalizedRank === "JKR" ? "J" : normalizedRank}
          </text>

          <text x="40" y="92" fontSize="36">
            {normalizedRank === "JKR" ? "🃏" : SUIT_SYMBOLS[suit]}
          </text>
        </g>
      </g>
    </svg>
  );
};
/* =========================================================
   FULL CARD
========================================================= */
export const PlayingCard = ({
  rank,
  suit = "S",
  size = 180,
  rotate = 0
}: CardProps) => {
  const color = getCardColor(suit, rank);
  const width = size;
  const height = width * 1.5;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block select-none shadow-sm rounded-xl"
    >
      <g transform={rotate ? `rotate(${getRotation(rotate)}, 100, 150)` : undefined}>
        <rect
          width="200"
          height="300"
          rx="12"
          fill="white"
          stroke={CARD_COLORS.BORDER}
          strokeWidth="2"
        />

        {/* Corner labels */}
        {rank !== "JKR" && (
          <g fill={color} fontFamily="Inter, sans-serif" fontWeight="900">
            <text x="12" y="32" fontSize="24">
              {rank}
            </text>
            <text x="12" y="54" fontSize="20">
              {SUIT_SYMBOLS[suit]}
            </text>

            <g transform="rotate(180, 100, 150)">
              <text x="12" y="32" fontSize="24">
                {rank}
              </text>
              <text x="12" y="54" fontSize="20">
                {SUIT_SYMBOLS[suit]}
              </text>
            </g>
          </g>
        )}

        <g fill={color}>
          {rank === "A" ? (
            <text x="100" y="175" fontSize="100" textAnchor="middle">
              {SUIT_SYMBOLS[suit]}
            </text>
          ) : ["J", "Q", "K"].includes(rank) ? (
            <g>
              <rect
                x="40"
                y="65"
                width="120"
                height="170"
                rx="4"
                fill={CARD_COLORS.BG_MUTED}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text x="100" y="175" fontSize="60" textAnchor="middle">
                {rank === "K" ? "👑" : rank === "Q" ? "👸" : "⚔️"}
              </text>
            </g>
          ) : rank === "JKR" ? (
            <text x="100" y="165" fontSize="40" textAnchor="middle" fontWeight="bold">
              🃏 JOKER
            </text>
          ) : (
            PIP_MAP[rank]?.map((p, i) => (
              <text
                key={i}
                x={p.x * 2}
                y={p.y * 3}
                fontSize="35"
                textAnchor="middle"
                transform={
                  p.flip
                    ? `rotate(180, ${p.x * 2}, ${p.y * 3})`
                    : undefined
                }
              >
                {SUIT_SYMBOLS[suit]}
              </text>
            ))
          )}
        </g>
      </g>
    </svg>
  );
};