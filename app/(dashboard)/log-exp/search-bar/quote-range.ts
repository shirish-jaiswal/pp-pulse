interface QuoteRange {
    from: number;
    to: number;
}

export const findQuoteRange = (
    doc: string,
    pos: number
): QuoteRange | null => {
    let openQuotePos = -1;

    let closeQuotePos = -1;

    /**
     * Opening quote
     */

    for (let i = pos - 1; i >= 0; i--) {
        if (
            doc[i] === " " ||
            doc[i] === "\n"
        ) {
            break;
        }

        if (doc[i] === '"') {
            openQuotePos = i;

            break;
        }
    }

    /**
     * Closing quote
     */

    for (
        let i = pos;
        i < doc.length;
        i++
    ) {
        if (
            doc[i] === " " ||
            doc[i] === "\n"
        ) {
            break;
        }

        if (doc[i] === '"') {
            closeQuotePos = i;

            break;
        }
    }

    if (
        openQuotePos === -1 ||
        closeQuotePos === -1
    ) {
        return null;
    }

    return {
        from: openQuotePos,
        to: closeQuotePos + 1,
    };
};