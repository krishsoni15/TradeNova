"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * TanStack Query provider
 * Wraps the app with QueryClientProvider and configures defaults
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale after 30 seconds — good for market data
            staleTime: 30 * 1000,
            // Cache for 5 minutes
            gcTime: 5 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
