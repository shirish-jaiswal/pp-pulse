import { GamePlugin } from "@/features/round-details/components/game-metadata/float-result/core/types";
import { sweetBonanzaPlugin } from "@/features/round-details/components/game-metadata/float-result/plugins/sweet-bonanza";
import { roulettePlugin } from "@/features/round-details/components/game-metadata/float-result/plugins/roulette";
import { baccaratPlugin } from "@/features/round-details/components/game-metadata/float-result/plugins/baccarat";
import { crashPlugin } from "@/features/round-details/components/game-metadata/float-result/plugins/crash-game";
import { gameShowPlugin } from "@/features/round-details/components/game-metadata/float-result/plugins/game-show";
import { treasureIslandPlugin } from "@/features/round-details/components/game-metadata/float-result/plugins/treasure-island";
import { GameType } from "@/utils/get-game-type";
import { blackjackPlugin } from "../plugins/blackjack";

export const gamePlugins: Record<GameType, GamePlugin> = {
    "sweet-bonanza": sweetBonanzaPlugin,
    roulette: roulettePlugin,
    baccarat: baccaratPlugin,
    "crash-game": crashPlugin,
    "game-show": gameShowPlugin,
    "treasure-island": treasureIslandPlugin,
    "other-card-game": baccaratPlugin,
    "non-card": gameShowPlugin,
    unknown: gameShowPlugin,
    "blackjack": blackjackPlugin,
    "sicbo": gameShowPlugin,
};