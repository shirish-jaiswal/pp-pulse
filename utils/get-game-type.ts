export type GameType =
  | "blackjack"
  | "baccarat"
  | "sicbo"
  | "other-card-game"
  | "non-card"
  | "unknown";

function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getGameType(gameType?: string): GameType {
  if (!gameType) return "unknown";

  const text = normalize(gameType);

  // ------------------
  // Blackjack
  // ------------------
  if (/\bblack\s*jack\b/.test(text) || /\bblackjack\b/.test(text) || /\bbj\b/.test(text)) {
    return "blackjack";
  }

  // ------------------
  // Baccarat
  // ------------------
  if (/\bbaccarat\b/.test(text)) {
    return "baccarat";
  }

  // ------------------
  // Sic Bo
  // ------------------
  if (/\bsic\s*bo\b/.test(text) || /\bsicbo\b/.test(text)) {
    return "sicbo";
  }

  // ------------------
  // fallback heuristics
  // ------------------
  const hasCardLikeKeywords =
    /\bcard\b/.test(text) ||
    /\bdealer\b/.test(text) ||
    /\bhand\b/.test(text);

  if (hasCardLikeKeywords) return "other-card-game";

  return "non-card";
}

const CARD_GAME_KEYWORDS: Array<RegExp> = [
  // Blackjack variations
  /\bblack\s*jack\b/i,
  /\bblackjack\b/i,
  /\bbj\b/i,

  // Baccarat variations
  /\bbaccarat\b/i,

  // Sic Bo variations
  /\bsic\s*bo\b/i,
  /\bsicbo\b/i,
];

// Optional: add aliases if you want future scaling
const CARD_GAME_ALIASES: string[] = [
  "21", // sometimes blackjack is referred as 21
];

export function isCardGame(gameType?: string): boolean {
  if (!gameType) return false;

  const text = normalize(gameType);

  // regex-based detection
  const matchesKeyword = CARD_GAME_KEYWORDS.some((regex) =>
    regex.test(text)
  );

  if (matchesKeyword) return true;

  return CARD_GAME_ALIASES.some((alias) =>
    text.includes(alias)
  );
}