// @/components/providers/QueryProvider.tsx
"use client";

import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity, // ✅ Lock global default queries as fresh indefinitely
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [persister] = useState(() =>
    createAsyncStoragePersister({
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      throttleTime: 0, // Write immediately to storage so refreshes don't lose data
    })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // Keep storage light by explicitly persisting log data structures
            return query.queryKey[0] === "logs";
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}