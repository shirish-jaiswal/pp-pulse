export const formatCompletionLabel = (
    value: string
) => {
    if (value.startsWith("@")) {
        return value;
    }

    if (value.includes("-")) {
        return `@${value}`;
    }

    return value;
};