const kibanaDataViewsQueryKey = "excel-data-views" as const;

// 2. Query Key Factory
export const kibanaDataViewsKeys = {
  all: [kibanaDataViewsQueryKey] as const,

  lists: () => [...kibanaDataViewsKeys.all, "list"] as const,

  list: (filters?: Record<string, any>) =>
    [...kibanaDataViewsKeys.lists(), { filters }] as const,

  details: () => [...kibanaDataViewsKeys.all, "detail"] as const,

  detail: (idOrUuid: number | string | null) =>
    [...kibanaDataViewsKeys.details(), idOrUuid] as const,
};