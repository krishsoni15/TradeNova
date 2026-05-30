"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchQuotes, fetchIndices, simulateQuotes, simulateIndices } from "@/services/market.service";
import type { MarketQuote, MarketIndex } from "@/services/market.service";

const POLL_INTERVAL_MS = 10_000; // 10 seconds for Yahoo Finance polling

/**
 * Real-time market quotes hook
 * Strategy:
 * 1. Initial fetch from Yahoo Finance via Next.js API route (real prices)
 * 2. Polls Yahoo Finance every 10 seconds for updated data
 * 3. Falls back to simulated data if Yahoo Finance is unreachable
 *
 * Note: Upstox WebSocket feed is not available in Next.js (no native WS support).
 * Yahoo Finance polling gives real prices with ~10s delay — perfectly fine for a dashboard.
 */
export function useMarketQuotes(symbols: string[]) {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [connectionType, setConnectionType] = useState<"yahoo" | "simulated">("yahoo");
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const symbolsKey = symbols.join(",");
  const mountedRef = useRef(true);

  // Fetch from Yahoo Finance via /api/market proxy
  const fetchData = useCallback(async () => {
    if (symbols.length === 0) return;

    try {
      const data = await fetchQuotes(symbols);
      if (data.length > 0 && mountedRef.current) {
        setQuotes(data);
        setLastUpdated(new Date());
        setIsLive(true);
        setConnectionType("yahoo");
      }
    } catch {
      // Only use simulated data if we have no data at all
      if (mountedRef.current) {
        setQuotes((prev) => {
          if (prev.length > 0) return prev;
          setConnectionType("simulated");
          return simulateQuotes(symbols);
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [symbolsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;

    // Initial fetch
    fetchData();

    // Start polling
    pollRef.current = setInterval(fetchData, POLL_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [fetchData]);

  return { quotes, isLoading, lastUpdated, isLive, connectionType };
}

/**
 * Market indices hook — always uses Yahoo Finance polling
 */
export function useMarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const load = async () => {
      try {
        const data = await fetchIndices();
        if (data.length > 0 && mountedRef.current) {
          setIndices(data);
          setLastUpdated(new Date());
        }
      } catch {
        if (mountedRef.current) {
          setIndices((prev) => (prev.length > 0 ? prev : simulateIndices()));
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    load();
    const interval = setInterval(load, 30_000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  return { indices, isLoading, lastUpdated };
}
