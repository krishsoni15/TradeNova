import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

// In-memory cache: keeps last successful result per symbol set
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 10_000; // 10 second cache

/**
 * Proxy route for Yahoo Finance API using yahoo-finance2
 * - Handles Yahoo's crumb/cookie auth automatically
 * - Caches results for 10s to avoid hammering the API
 * - Returns cached data on network failures
 * GET /api/market?symbols=RELIANCE.NS,TCS.NS
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbolsParam = searchParams.get("symbols");

  if (!symbolsParam) {
    return NextResponse.json({ error: "symbols param required" }, { status: 400 });
  }

  const cacheKey = symbolsParam;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  // Return cache if fresh enough
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: { "X-Cache": "HIT", "Cache-Control": "public, s-maxage=10" },
    });
  }

  try {
    const symbols = symbolsParam.split(",");
    const results = await yahooFinance.quote(symbols);
    const quotesArray = Array.isArray(results) ? results : [results];

    const quotes = quotesArray.map((q: any) => ({
      symbol: String(q.symbol ?? "").replace(/\.(NS|BO)$/, ""),
      displayName: String(q.shortName ?? q.longName ?? q.symbol ?? ""),
      price: Number(q.regularMarketPrice ?? 0),
      change: Number(q.regularMarketChange ?? 0),
      changePercent: Number(q.regularMarketChangePercent ?? 0),
      volume: Number(q.regularMarketVolume ?? 0),
      high: Number(q.regularMarketDayHigh ?? 0),
      low: Number(q.regularMarketDayLow ?? 0),
      open: Number(q.regularMarketOpen ?? 0),
      previousClose: Number(q.regularMarketPreviousClose ?? 0),
      marketCap: Number(q.marketCap ?? 0),
      pe: Number(q.trailingPE ?? 0),
      weekHigh52: Number(q.fiftyTwoWeekHigh ?? 0),
      weekLow52: Number(q.fiftyTwoWeekLow ?? 0),
    }));

    const responseData = { quotes };

    // Update cache
    cache.set(cacheKey, { data: responseData, timestamp: now });

    return NextResponse.json(responseData, {
      headers: { "X-Cache": "MISS", "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5" },
    });
  } catch (err: any) {
    // On network failure, return stale cache if available
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: { "X-Cache": "STALE", "Cache-Control": "public, s-maxage=5" },
      });
    }
    console.error("[Market API]", err?.message || err);
    return NextResponse.json({ error: "Failed to fetch market data", quotes: [] }, { status: 500 });
  }
}
