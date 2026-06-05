"use client";

export type GameType =
  | "blackjack"
  | "baccarat"
  | "sicbo"
  | "roulette"
  | "game-show"
  | "treasure-island"
  | "spaceman"         // Dedicated type
  | "highflyer"        // Dedicated type
  | "big-bass"         // Added dedicated type
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

  // -----------------------
  // Blackjack
  // -----------------------
  if (
    text.includes("blackjack") ||
    text.includes("black jack") ||
    /\bbj\b/.test(text)
  ) {
    return "blackjack";
  }

  // -----------------------
  // Baccarat
  // -----------------------
  if (text.includes("baccarat")) {
    return "baccarat";
  }

  // -----------------------
  // Sic Bo
  // -----------------------
  if (
    text.includes("sicbo") ||
    text.includes("sic bo") ||
    /\bsic\s*bo\b/.test(text)
  ) {
    return "sicbo";
  }

  // -----------------------
  // Roulette
  // -----------------------
  const ROULETTE_LIKE_GAMES = [
    /\broulette\b/,
    /\bgates\s*of\s*olympus\b/,
    /\bgatesofolympus\b/,
  ];

  if (
    text.includes("roulette") ||
    text.includes("gates of olympus") ||
    text.includes("gatesofolympus") ||
    ROULETTE_LIKE_GAMES.some((regex) => regex.test(text))
  ) {
    return "roulette";
  }

  // -----------------------
  // Sweet Bonanza
  // -----------------------
  if (
    text.includes("sweet bonanza") ||
    text.includes("sweetbonanza") ||
    /\bsweet\s*bonanza\b/.test(text)
  ) {
    return "sweet-bonanza";
  }

  // -----------------------
  // Treasure Island
  // -----------------------
  if (
    text.includes("treasure island") ||
    /\btreasure\s*island\b/.test(text)
  ) {
    return "treasure-island";
  }

  // -----------------------
  // Game Shows
  // -----------------------
  if (
    text.includes("mega wheel") ||
    text.includes("money time") ||
    /\bmega\s*wheel\b/.test(text) ||
    /\bmoney\s*time\b/.test(text)
  ) {
    return "game-show";
  }

  // -----------------------
  // Spaceman
  // -----------------------
  if (text.includes("spaceman") || /\bspaceman\b/.test(text)) {
    return "spaceman";
  }

  // -----------------------
  // High Flyer
  // -----------------------
  if (
    text.includes("high flyer") ||
    text.includes("highflyer") ||
    /\bhigh\s*flyer\b/.test(text)
  ) {
    return "highflyer";
  }

  // -----------------------
  // Big Bass
  // -----------------------
  if (
    text.includes("big bass") ||
    text.includes("bigbass") ||
    /\bbig\s*bass\b/.test(text)
  ) {
    return "big-bass";
  }

  // -----------------------
  // Card game fallback heuristics
  // -----------------------
  const hasCardLikeKeywords =
    text.includes("card") ||
    text.includes("dealer") ||
    text.includes("hand") ||
    /\bcard\b/.test(text) ||
    /\bdealer\b/.test(text) ||
    /\bhand\b/.test(text);

  if (hasCardLikeKeywords) return "other-card-game";

  return "non-card";
}

const CARD_GAME_KEYWORDS: Array<RegExp> = [
  /\bblack\s*jack\b/i,
  /\bblackjack\b/i,
  /\bbj\b/i,
  /\bbaccarat\b/i,
  /\bsic\s*bo\b/i,
  /\bsicbo\b/i,
];

const CARD_GAME_ALIASES: string[] = [
  "21",
];

/**
 * Returns true if the game is identified as a card-based game.
 */
export function isCardGame(gameType?: string): boolean {
  if (!gameType) return false;

  const text = normalize(gameType);

  // Guardrail: Explicitly ensure Spaceman, High Flyer, and Big Bass skip card checks
  if (
    text.includes("spaceman") ||
    text.includes("high flyer") ||
    text.includes("highflyer") ||
    text.includes("big bass") ||
    text.includes("bigbass")
  ) {
    return false;
  }

  if (
    text.includes("blackjack") ||
    text.includes("black jack") ||
    text.includes("baccarat") ||
    text.includes("sicbo") ||
    text.includes("sic bo")
  ) {
    return true;
  }

  const matchesKeyword = CARD_GAME_KEYWORDS.some((regex) =>
    regex.test(text)
  );

  if (matchesKeyword) return true;

  return CARD_GAME_ALIASES.some((alias) => text.includes(alias));
}

export type BroadCategory =
  | "BLACKJACK"
  | "BACCARAT"
  | "SPACEMAN"        // Broad category
  | "HIGHFLYER"       // Broad category
  | "BIG_BASS"        // Added broad category
  | "SWEET_BONANZA"
  | "TREASURE_ISLAND"
  | "OTHER";

/**
 * Maps the detailed GameType into the broad categories.
 */
export function getBroadCategory(gameType: GameType): BroadCategory {
  switch (gameType) {
    case "blackjack":
      return "BLACKJACK";

    case "baccarat":
      return "BACCARAT";

    case "spaceman":
      return "SPACEMAN";

    case "highflyer":
      return "HIGHFLYER";

    case "big-bass":
      return "BIG_BASS";

    case "sweet-bonanza":
      return "SWEET_BONANZA";

    case "treasure-island":
      return "TREASURE_ISLAND";

    default:
      return "OTHER";
  }
}