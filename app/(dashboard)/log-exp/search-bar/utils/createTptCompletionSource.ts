import { CompletionContext, CompletionResult, snippet } from "@codemirror/autocomplete";

export const createTptCompletionSource = (roundDetails: any) => {
    return (context: CompletionContext): CompletionResult | null => {
        // Match if the user types '@' at the end of a word boundary or empty line
        const word = context.matchBefore(/@/);
        if (!word) return null;

        return {
            from: word.from,
            options: [
                {
                    label: "@ (Log Filter Template)",
                    displayLabel: "@round-game-user",
                    type: "keyword",
                    boost: 99, // Make sure it sits at the top
                    // This creates the fields. #{1}, #{2}, and #{3} are your tab stops.
                    apply: snippet("@#{[round]}-#{[game]}-#{[user]}"),
                }
            ]
        };
    };
};