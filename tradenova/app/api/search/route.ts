import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // 1. Search for matching symbols (append .NS to prioritize Indian stocks if not present)
    const searchQuery = q.endsWith(".NS") ? q : `${q}.NS`;
    const searchResults = await yahooFinance.search(searchQuery, { quotesCount: 8, newsCount: 0 });
    
    // Fallback: If no Indian stocks found, search globally
    let quotesToFetch = searchResults.quotes.filter(s => s.symbol.endsWith(".NS") || s.symbol.endsWith(".BO"));
    if (quotesToFetch.length === 0) {
        const fallbackResults = await yahooFinance.search(q, { quotesCount: 5, newsCount: 0 });
        quotesToFetch = fallbackResults.quotes.filter(s => s.symbol.endsWith(".NS") || s.symbol.endsWith(".BO"));
    }

    const symbols = quotesToFetch.map(s => s.symbol);

    if (symbols.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // 2. Fetch real-time quotes for those symbols
    const quotes = await yahooFinance.quote(symbols);
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

    const results = quotesArray.map((q: any) => ({
      symbol: q.symbol.replace(/\.(NS|BO)$/, ""),
      displayName: q.shortName || q.longName || q.symbol,
      price: q.regularMarketPrice || 0,
      changePercent: q.regularMarketChangePercent || 0,
      exchange: q.exchange || "NSE"
    }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[Search API] Error:", err);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
