export const normalize = (input: any) => {
    if (input === null || input === undefined) return "";

    return String(input)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .trim();
};