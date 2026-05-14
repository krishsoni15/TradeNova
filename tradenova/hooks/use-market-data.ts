"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchQuotes, fetchIndices, simulateQuotes, simulateIndices } from "@/services/market.service";
import type { MarketQuote, MarketIndex } from "@/services/market.service";

const REFRESH_INTERVAL_MS = 15_000; // 15 seconds — balanced between freshness and network load

/**
 * Real-time market quotes hook
 * Keeps last successful data on network failures instead of falling back to simulation
 */
export function useMarketQuotes(symbols: string[]) {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasRealData = useRef(false);
  const failCount = useRef(0);

  const load = useCallback(async () => {
    try {
      const data = await fetchQuotes(symbols);
      if (data.length > 0) {
        setQuotes(data);
        setLastUpdated(new Date());
        setIsLive(true);
        hasRealData.current = true;
        failCount.current = 0;
      }
    } catch {
      failCount.current++;
      // Only use simulated data if we NEVER had real data
      if (!hasRealData.current) {
        setQuotes(simulateQuotes(symbols));
        setLastUpdated(new Date());
        setIsLive(false);
      }
      // If we had real data before, just keep it (stale but real)
      // Only log once, not every 10 seconds
      if (failCount.current === 1) {
        console.warn("[TradeNova] Network issue — keeping last known prices");
      }
    } finally {
      setIsLoading(false);
    }
  }, [symbols.join(",")]); // eslint-disable-line

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);

  return { quotes, isLoading, lastUpdated, isLive, refetch: load };
}

/**
 * Real-time market indices hook (Nifty, Sensex, Bank Nifty, IT)
 */
export function useMarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasRealData = useRef(false);
  const failCount = useRef(0);

  const load = useCallback(async () => {
    try {
      const data = await fetchIndices();
      if (data.length > 0) {
        setIndices(data);
        setLastUpdated(new Date());
        hasRealData.current = true;
        failCount.current = 0;
      }
    } catch {
      failCount.current++;
      if (!hasRealData.current) {
        setIndices(simulateIndices());
        setLastUpdated(new Date());
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);

  return { indices, isLoading, lastUpdated, refetch: load };
}
