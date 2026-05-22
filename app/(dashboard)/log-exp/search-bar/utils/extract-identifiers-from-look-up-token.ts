export interface ExtractedLookupIdentifiers {
  roundId: string;
  gameId: string;
  userId: string;
}

export const extractIdentifiersFromLookupToken = (rawInputToken: string): ExtractedLookupIdentifiers => {
  // 1. Strip whitespace, outer quotes, and the leading '@' symbol
  let cleanToken = rawInputToken.trim().replace(/"/g, "");
  if (cleanToken.startsWith("@")) {
    cleanToken = cleanToken.slice(1);
  }

  // 2. Split the token values into segments by hyphens
  const segments = cleanToken.split("-");

  console.log("Splitting token segments:", { rawInputToken, cleanToken, segments });

  // Case 1: Stored as @-gameId-userId (e.g. "", "-13386797111", "ppc1735125590048")
  if (segments[0] === "" && segments.length >= 3) {
    return {
      roundId: "",
      // Re-attach the negative sign that was removed during the split operation
      gameId: `${segments[1]}`,
      userId: segments[2] || "",
    };
  }

  // Case 2: Standard 3-segment token fallback (@roundId-gameId-userId)
  if (segments.length === 3) {
    return {
      roundId: segments[0],
      gameId: segments[1],
      userId: segments[2],
    };
  }

  // Case 3: Standard 2-segment token fallback (@roundId-gameId)
  return {
    roundId: segments[0] || "",
    gameId: segments[1] || "",
    userId: "",
  };
};