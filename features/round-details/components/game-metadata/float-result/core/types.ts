import { RoundMetaInfo } from "@/features/round-details/types/game-details";
import { CardDetailsInfo } from "@/features/round-details/types/card-details";
import { GameType } from "@/utils/get-game-type";
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";

export type FloatingGameResult = {
    label: string;
    imgurl?: string;
    className?: string;
    textClassName?: string;
};

export type HandlerParams = {
    gameDetails: RoundMetaInfo;
    cardDetails: CardDetailsInfo;
    cardMapping?: any;
    styleMap: Record<string, string>;
    betTable?: BetTableInfo;
    context: any;
};

export type GamePlugin = {
    key: GameType;
    resolve: (params: HandlerParams) => FloatingGameResult;
};