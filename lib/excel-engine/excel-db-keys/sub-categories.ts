// Excel Engine - Resolution Template Query Keys

const subCategoriesQueryKey: string = "subcategories";

export const subCategoriesKeys = {
    all: [subCategoriesQueryKey] as const,

    lists: () => [...subCategoriesKeys.all, "list"] as const,

    list: () =>
        [...subCategoriesKeys.lists()] as const,
};