// Excel Engine - Resolution Template Query Keys

const categoriesQueryKey: string = "categories";

export const categoriesKeys = {
    all: [categoriesQueryKey] as const,

    lists: () => [...categoriesKeys.all, "list"] as const,

    list: () =>
        [...categoriesKeys.lists()] as const,
};