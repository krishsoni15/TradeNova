import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { positionsService, type Position } from "@/services/positions.service";
import { useMarketQuotes } from "@/hooks/use-market-data";

/**
 * Custom hook for fetching active positions with TanStack Query.
 * Integrates real-time market data updates dynamically.
 */
export function usePositions() {
  const query = useQuery({
    queryKey: ["positions"],
    queryFn: positionsService.getPositions,
    refetchInterval: 10 * 1000, // Poll positions every 10s for active trading updates
    placeholderData: (previousData) => previousData,
  });

  // Extract F&O/equity symbols that match our watchlist format
  const symbols = useMemo(() => {
    return query.data?.map((p) => p.symbol) ?? [];
  }, [query.data]);

  // Fetch real-time quotes from Yahoo Finance proxy
  const { quotes } = useMarketQuotes(symbols);

  // Merge real-time quotes into positions data
  const livePositions = useMemo(() => {
    if (!query.data) return undefined;

    const quoteMap = new Map(quotes.map(q => [q.symbol, q]));

    return query.data.map((p) => {
      const q = quoteMap.get(p.symbol);
      if (!q) return p;

      // Calculate live P&L based on LTP
      const newLtp = q.price;
      const netQty = p.qty;
      const isShort = netQty < 0;
      
      let pnl = 0;
      if (netQty !== 0) {
        if (isShort) {
          pnl = (p.avgPrice - newLtp) * Math.abs(netQty);
        } else {
          pnl = (newLtp - p.avgPrice) * netQty;
        }
      }

      const pnlPct = p.avgPrice > 0 ? (pnl / (p.avgPrice * Math.abs(netQty))) * 100 : 0;

      return {
        ...p,
        ltp: newLtp,
        pnl,
        pnlPct,
      };
    });
  }, [query.data, quotes]);

  return {
    ...query,
    data: livePositions ?? query.data,
  };
}
