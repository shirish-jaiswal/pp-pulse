import { AutoCompleteItem } from "../types";

export const filterCompletionOptions = (
    items: AutoCompleteItem[],
    search: string
) => {
    return items
        .filter((item) =>
            item.name
                .toLowerCase()
                .includes(search)
        )
        .slice(0, 50);
};