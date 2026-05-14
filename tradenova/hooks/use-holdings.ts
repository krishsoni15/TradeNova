import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { holdingsService } from "@/services/holdings.service";
import { useMarketQuotes } from "@/hooks/use-market-data";
import type { PortfolioSummary, Holding, HoldingsResponse } from "@/types/holdings";

/**
 * Custom hook for fetching holdings data
 * Uses TanStack Query with auto-refetch for near-real-time updates
 */
export function useHoldings() {
  const query = useQuery({
    queryKey: ["holdings"],
    queryFn: holdingsService.getHoldings,
    refetchInterval: 60 * 1000, // Background sync every 1 minute
    placeholderData: (previousData) => previousData,
  });

  // Extract symbols from holdings
  const symbols = useMemo(() => {
    return query.data?.holdings.map((h) => h.tradingsymbol) ?? [];
  }, [query.data?.holdings]);

  // Fetch real-time quotes for those symbols
  const { quotes } = useMarketQuotes(symbols);

  // Merge real-time quotes into holdings data
  const liveData = useMemo(() => {
    if (!query.data) return undefined;
    
    // Create map for O(1) lookups
    const quoteMap = new Map(quotes.map(q => [q.symbol, q]));
    
    const liveHoldings = query.data.holdings.map(h => {
      const q = quoteMap.get(h.tradingsymbol);
      if (!q) return h;
      
      // Calculate live P&L based on new LTP
      const newCurrentValue = h.quantity * q.price;
      const newPnl = newCurrentValue - h.invested_value;
      const newPnlPct = h.invested_value > 0 ? (newPnl / h.invested_value) * 100 : 0;
      const newDayChangePct = q.changePercent;
      const newDayChange = q.change;
      
      return {
        ...h,
        last_price: q.price,
        current_value: newCurrentValue,
        pnl: newPnl,
        pnl_percentage: newPnlPct,
        day_change: newDayChange,
        day_change_percentage: newDayChangePct,
      };
    });
    
    // Recompute total summary
    const total_investment = liveHoldings.reduce((sum, h) => sum + h.invested_value, 0);
    const current_value = liveHoldings.reduce((sum, h) => sum + h.current_value, 0);
    const total_pnl = current_value - total_investment;
    const total_pnl_percentage = total_investment > 0 ? (total_pnl / total_investment) * 100 : 0;
    const day_pnl = liveHoldings.reduce((sum, h) => sum + h.day_change * h.quantity, 0);
    const day_pnl_percentage = current_value > 0 ? (day_pnl / (current_value - day_pnl)) * 100 : 0;
    
    const liveSummary: PortfolioSummary = {
      total_investment,
      current_value,
      total_pnl,
      total_pnl_percentage,
      day_pnl,
      day_pnl_percentage,
      total_holdings: liveHoldings.length,
    };
    
    return {
      holdings: liveHoldings,
      summary: liveSummary,
    } as HoldingsResponse;
  }, [query.data, quotes]);

  return {
    ...query,
    data: liveData ?? query.data,
  };
}
