export const styleMap = {
  /**
   * ROULETTE (high contrast, classic casino feel)
   */
  "roulette-red":
    "bg-red-500/90 border-red-700 text-white",

  "roulette-black":
    "bg-zinc-900 border-zinc-950 text-white",

  "roulette-tie":
    "bg-emerald-500/90 border-emerald-700 text-white",

  /**
   * BACCARAT (premium, softer tones)
   */
  "baccarat-player":
    "bg-sky-600/90 border-sky-800 text-white",

  "baccarat-banker":
    "bg-rose-500/90 border-rose-800 text-white",

  "baccarat-tie":
    "bg-slate-600 border-slate-800 text-white",

  /**
   * BLACKJACK (status-driven, readable states)
   */
  "blackjack-win":
    "bg-emerald-600/90 border-emerald-800 text-white",

  "blackjack-partial":
    "bg-amber-400/90 border-amber-600 text-black",

  "blackjack-lose":
    "bg-rose-600/90 border-rose-900 text-white",

  "blackjack-push":
    "bg-slate-500/90 border-slate-700 text-white",

  "blackjack-dealer-bust":
    "bg-violet-600/90 border-violet-800 text-white",

  "blackjack-blackjack":
    "bg-yellow-300 border-yellow-500 text-black",

  "blackjack-bust":
    "bg-zinc-800 border-zinc-950 text-white",

  "blackjack-double":
    "bg-cyan-600/90 border-cyan-800 text-white",

  "blackjack-split":
    "bg-indigo-600/90 border-indigo-800 text-white",

  "blackjack-insurance":
    "bg-teal-600/90 border-teal-800 text-white",

  /**
   * TREASURE ISLAND (distinct themed green-gold vibe)
   */
  "treasure-island":
    "bg-emerald-700/90 border-emerald-900 text-white",

  /**
   * CRASH (high tension / tech vibe)
   */
  crash:
    "bg-indigo-700/90 border-indigo-900 text-white",

  /**
   * DEFAULT
   */
  default:
    "bg-zinc-500 border-zinc-700 text-white",
} as const;