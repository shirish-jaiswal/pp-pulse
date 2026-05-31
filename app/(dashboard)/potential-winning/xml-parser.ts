export interface ParsedBet {
  bc: string;
  amt: number;
}

/**
 * Parses raw XML message elements to pull attributes out of <bet /> elements.
 * Handles variations in attribute ordering (amt before bc or vice-versa).
 */
export function parseIncomingMessage(xmlString: string): ParsedBet[] {
  const bets: ParsedBet[] = [];
  
  const betRegex = /<bet\s+[^>]*amt="(\d+)"[^>]*bc="(\d+)"|<bet\s+[^>]*bc="(\d+)"[^>]*amt="(\d+)"/g;
  let match;

  while ((match = betRegex.exec(xmlString)) !== null) {
    const amt = match[1] || match[4];
    const bc = match[2] || match[3];
    if (bc && amt) {
      bets.push({ bc, amt: parseFloat(amt) });
    }
  }
  return bets;
}