import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { CardDetailsInfo } from "@/features/round-details/types/card-details";
import { getGameType } from "@/utils/get-game-type";
import BaccaratHandReport from "@/features/round-details/components/game-metadata/game-result/result-sheets/baccarat/baccarat";
export default function AddationalDetailsWrapper({
  items,
}: {
  items?: CardDetailsInfo;
  isCardGame?: boolean;
}) {
  const { roundDetails } = useRoundDetails();

  const gameType = getGameType(
    roundDetails?.gameDetails?.[0]?.game_type
  );

  if (gameType === "baccarat") {
    return <BaccaratHandReport events={items} />;
  }

  return null;
}