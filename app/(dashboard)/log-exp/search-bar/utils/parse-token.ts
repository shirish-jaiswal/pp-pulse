export interface ParsedToken {
    roundId?: string;

    gameId?: string;

    userId?: string;
}

export const parseTptToken = (
    value: string
): ParsedToken => {
    const regex =
        /@([a-zA-Z0-9_-]+)(?:-([a-zA-Z0-9_-]+))?(?:-([a-zA-Z0-9_-]+))?/;

    const match = value.match(regex);

    if (!match) {
        return {};
    }

    return {
        roundId: match[1],

        gameId: match[2],

        userId: match[3],
    };
};