export type GameType =
  | "blackjack"
  | "baccarat"
  | "sicbo"
  | "roulette"
  | "game-show"
  | "crash-game"
  | "sweet-bonanza"
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

/**
 * Categorizes a game based on its title or type string.
 */
export function getGameType(gameType?: string): GameType {
  if (!gameType) return "unknown";

  const text = normalize(gameType);

  // Blackjack
  if (
    /\bblack\s*jack\b/.test(text) ||
    /\bblackjack\b/.test(text) ||
    /\bbj\b/.test(text)
  ) {
    return "blackjack";
  }

  // Baccarat
  if (/\bbaccarat\b/.test(text)) {
    return "baccarat";
  }

  // Sic Bo
  if (/\bsic\s*bo\b/.test(text) || /\bsicbo\b/.test(text)) {
    return "sicbo";
  }

  // Roulette
  if (/\broulette\b/.test(text)) {
    return "roulette";
  }

  // Sweet Bonanza
  if (
    /\bsweet\s*bonanza\b/.test(text) ||
    /\bsweetbonanza\b/.test(text)
  ) {
    return "sweet-bonanza";
  }

  // Game Shows
  if (
    /\bmega\s*wheel\b/.test(text) ||
    /\btreasure\s*island\b/.test(text) ||
    /\bmoney\s*time\b/.test(text)
  ) {
    return "game-show";
  }

  // Crash Games
  if (
    /\bspaceman\b/.test(text) ||
    /\bhigh\s*flyer\b/.test(text) ||
    /\bhighflyer\b/.test(text)
  ) {
    return "crash-game";
  }

  // Fallback heuristics for card games
  const hasCardLikeKeywords =
    /\bcard\b/.test(text) || /\bdealer\b/.test(text) || /\bhand\b/.test(text);

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

const CARD_GAME_ALIASES: string[] = [
  "21", // Blackjack alias
];

/**
 * Returns true if the game is identified as a card-based game.
 */
export function isCardGame(gameType?: string): boolean {
  if (!gameType) return false;

  const text = normalize(gameType);

  // Regex-based detection
  const matchesKeyword = CARD_GAME_KEYWORDS.some((regex) => regex.test(text));

  if (matchesKeyword) return true;

  // Alias-based detection
  return CARD_GAME_ALIASES.some((alias) => text.includes(alias));
}

export type BroadCategory =
  | "BLACKJACK"
  | "BACCARAT"
  | "CRASH"
  | "SWEET_BONANZA"
  | "OTHER";

/**
 * Maps the detailed GameType into the four broad categories.
 */
export function getBroadCategory(gameType: GameType): BroadCategory {
  switch (gameType) {
    case "blackjack":
      return "BLACKJACK";

    case "baccarat":
      return "BACCARAT";

    case "crash-game":
      return "CRASH";

    case "sweet-bonanza":
      return "SWEET_BONANZA";

    default:
      return "OTHER";
  }
}