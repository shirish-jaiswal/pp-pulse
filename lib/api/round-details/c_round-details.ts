import {
  RoundDetailsInputFormSchema,
  RoundDetailsInputProps,
} from "@/features/round-details/types/round-details-input";
import apiRequest from "@/lib/api/api-request";
import { getGameType, isCardGame } from "@/utils/get-game-type";

export async function c_getRoundDetails(
  rawData: RoundDetailsInputProps
): Promise<any> {
  try {
    const data = RoundDetailsInputFormSchema.parse(rawData);

    const queryParams: Record<string, any> = {};

    if (data.round_id) {
      queryParams.roundId = data.round_id;
    } else {
      if (data.game_id) queryParams.gameId = data.game_id;
      if (data.user_id) queryParams.userId = data.user_id;
    }

    // 1. Fetch primary round data concurrently (safeguarded against individual failures)
    const [tptInfo, betInfo, gameDetails] = await Promise.all(
      [
        apiRequest({
          method: "GET",
          endpoint: "tpttableinfo",
          params: queryParams,
          requireCookie: true,
        }),
        apiRequest({
          method: "GET",
          endpoint: "bettableinfo",
          params: queryParams,
          requireCookie: true,
        }),
        apiRequest({
          method: "GET",
          endpoint: "gamedetails",
          params: queryParams,
          requireCookie: true,
        }),
      ].map((promise) => promise.catch((err) => {
        console.error("An initial API request failed:", err);
        return null;
      }))
    );

    const gameType = getGameType(gameDetails?.data?.[0]?.game_type || ""); 

    // 2. Determine conditional steps based on the game type
    const cardGame = isCardGame(gameType);
    const isCrashGame = gameType === "spaceman" || gameType === "big-bass" || gameType === "highflyer";
    const isHighflyer = gameType === "highflyer";
    
    console.log("GameType:", gameType, "IsCardGame:", cardGame, "IsCrashGame:", isCrashGame, "IsHighflyer:", isHighflyer);
    
    let cardDetails = null;
    let crashGamesData = null;
    let highflyerData = null;

    // 3. Conditionally fetch card details if applicable (safeguarded)
    if (cardGame) {
      try {
        cardDetails = await apiRequest({
          method: "GET",
          endpoint: "carddetails",
          params: queryParams,
          requireCookie: true,
        });
      } catch (error) {
        console.error("Error fetching card details:", error);
      }
    }

    // 4. Conditionally fetch crash details or highflyer details
    if (isCrashGame) {
      const crashQueryParams = {
        ...queryParams,
        ...(gameType ? { gameType : gameType.toUpperCase() } : {}),
      };

      try {
        // Adjust endpoint if your highflyer API uses a different identifier prefix or path
        const isHighflyerEndpoint = isHighflyer ? "crashgamesdata" : "crashgamesdata"; 
        
        const crashResponse = await apiRequest({
          method: "GET",
          endpoint: isHighflyerEndpoint,
          params: crashQueryParams,
          requireCookie: true,
        });

        if (isHighflyer) {
          highflyerData = crashResponse?.data ?? null;
        } else {
          crashGamesData = crashResponse?.data ?? null;
        }
      } catch (error) {
        console.error("Error fetching crash/highflyer games data:", error);
      }
    }

    // 5. Consolidated response
    return {
      tptInfo: tptInfo?.data ?? null,
      betInfo: betInfo?.data ?? null,
      gameDetails: gameDetails?.data ?? null,
      cardDetails: cardDetails?.data ?? null,
      crashGamesData: crashGamesData,
      highflyerData: highflyerData,
      isCardGame: cardGame,
      isCrashGame: isCrashGame,
    };
  } catch (error) {
    console.error("Error parsing inputs or general orchestration failure:", error);
    return {
      tptInfo: null,
      betInfo: null,
      gameDetails: null,
      cardDetails: null,
      crashGamesData: null,
      highflyerData: null,
      isCardGame: false,
      isCrashGame: false,
    };
  }
}