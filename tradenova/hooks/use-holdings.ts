import { useQuery } from "@tanstack/react-query";
import { holdingsService } from "@/services/holdings.service";

/**
 * Custom hook for fetching holdings data
 * Uses TanStack Query with auto-refetch for near-real-time updates
 */
export function useHoldings() {
  return useQuery({
    queryKey: ["holdings"],
    queryFn: holdingsService.getHoldings,
    // Refetch every 30 seconds for somewhat live data
    refetchInterval: 30 * 1000,
    // Keep previous data while refetching
    placeholderData: (previousData) => previousData,
  });
}
