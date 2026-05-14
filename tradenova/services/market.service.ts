/**
 * Market Data Service
 * Uses Yahoo Finance API (free, no API key required)
 * Supports NSE Indian stocks by appending .NS suffix
 */

export interface MarketQuote {
  symbol: string;
  displayName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: number;
  pe?: number;
  weekHigh52?: number;
  weekLow52?: number;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

// Top NSE stocks for the live ticker
export const WATCHLIST_SYMBOLS = [
  "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
  "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL", "KOTAKBANK",
  "LT", "AXISBANK", "ASIANPAINT", "MARUTI", "SUNPHARMA",
];

/**
 * Fetch stock quotes from Yahoo Finance via Next.js API proxy
 * We proxy through /api/market to avoid CORS
 */
export async function fetchQuotes(symbols: string[]): Promise<MarketQuote[]> {
  try {
    const nseSymbols = symbols.map((s) => s + ".NS");
    const joined = nseSymbols.join(",");
    const res = await fetch(`/api/market?symbols=${encodeURIComponent(joined)}`);
    if (!res.ok) throw new Error("Market API error");
    const data = await res.json();
    return data.quotes as MarketQuote[];
  } catch {
    console.warn("[TradeNova] Market data fetch failed — using simulated data");
    return simulateQuotes(symbols);
  }
}

/**
 * Fetch major Indian market indices
 */
export async function fetchIndices(): Promise<MarketIndex[]> {
  try {
    const indexSymbols = ["^NSEI", "^BSESN", "^NSEBANK", "^CNXIT"].join(",");
    const res = await fetch(`/api/market?symbols=${encodeURIComponent(indexSymbols)}`);
    if (!res.ok) throw new Error("Indices API error");
    const data = await res.json();
    const names = ["NIFTY 50", "SENSEX", "NIFTY BANK", "NIFTY IT"];
    return data.quotes.map((q: MarketQuote, i: number) => ({
      name: names[i],
      symbol: q.symbol,
      value: q.price,
      change: q.change,
      changePercent: q.changePercent,
    }));
  } catch {
    return simulateIndices();
  }
}

/** Simulate live-looking market data for development/fallback */
export function simulateQuotes(symbols: string[]): MarketQuote[] {
  const baseData: Record<string, Partial<MarketQuote>> = {
    RELIANCE: { price: 2678.35, change: 23.35, changePercent: 0.88, volume: 4200000, high: 2692, low: 2650, open: 2655, previousClose: 2655 },
    TCS: { price: 3789.5, change: -20.5, changePercent: -0.54, volume: 890000, high: 3820, low: 3775, open: 3810, previousClose: 3810 },
    HDFCBANK: { price: 1695.2, change: 7.2, changePercent: 0.43, volume: 3100000, high: 1702, low: 1685, open: 1688, previousClose: 1688 },
    INFY: { price: 1425.6, change: -4.4, changePercent: -0.31, volume: 2500000, high: 1435, low: 1418, open: 1430, previousClose: 1430 },
    ICICIBANK: { price: 1098.75, change: 13.75, changePercent: 1.27, volume: 5200000, high: 1105, low: 1082, open: 1085, previousClose: 1085 },
    HINDUNILVR: { price: 2345.8, change: 15.3, changePercent: 0.66, volume: 780000, high: 2360, low: 2330, open: 2330, previousClose: 2330.5 },
    ITC: { price: 458.2, change: 2.4, changePercent: 0.53, volume: 9800000, high: 462, low: 454, open: 455.8, previousClose: 455.8 },
    SBIN: { price: 812.6, change: -5.6, changePercent: -0.69, volume: 8200000, high: 820, low: 808, open: 818.2, previousClose: 818.2 },
    BHARTIARTL: { price: 1789.4, change: 28.4, changePercent: 1.61, volume: 1900000, high: 1795, low: 1760, open: 1761, previousClose: 1761 },
    KOTAKBANK: { price: 1892.3, change: 8.3, changePercent: 0.44, volume: 1200000, high: 1900, low: 1880, open: 1884, previousClose: 1884 },
    LT: { price: 3456.8, change: 34.8, changePercent: 1.02, volume: 670000, high: 3470, low: 3420, open: 3422, previousClose: 3422 },
    AXISBANK: { price: 1123.5, change: -8.5, changePercent: -0.75, volume: 4100000, high: 1135, low: 1118, open: 1132, previousClose: 1132 },
    ASIANPAINT: { price: 2678.9, change: 12.9, changePercent: 0.48, volume: 420000, high: 2690, low: 2660, open: 2666, previousClose: 2666 },
    MARUTI: { price: 12450.6, change: 156.6, changePercent: 1.27, volume: 230000, high: 12480, low: 12290, open: 12294, previousClose: 12294 },
    SUNPHARMA: { price: 1634.2, change: 18.2, changePercent: 1.13, volume: 1650000, high: 1642, low: 1615, open: 1616, previousClose: 1616 },
  };

  return symbols.map((sym) => {
    const base = baseData[sym];
    if (!base) return null; // Do not return fake 1000 prices for real user holdings!

    const jitter = (Math.random() - 0.5) * ((base.price ?? 1000) * 0.003);
    const livePrice = parseFloat(Math.max(0.01, (base.price ?? 1000) + jitter).toFixed(2));
    const liveChange = parseFloat(((base.change ?? 0) + jitter).toFixed(2));
    const livePct = parseFloat((liveChange / (base.previousClose ?? 1000) * 100).toFixed(2));
    return {
      symbol: sym,
      displayName: sym,
      price: livePrice,
      change: liveChange,
      changePercent: livePct,
      volume: base.volume ?? 1000000,
      high: base.high ?? livePrice * 1.01,
      low: base.low ?? livePrice * 0.99,
      open: base.open ?? livePrice,
      previousClose: base.previousClose ?? livePrice,
    };
  }).filter(Boolean) as MarketQuote[];
}

export function simulateIndices(): MarketIndex[] {
  const jitter = () => (Math.random() - 0.5) * 30;
  return [
    { name: "NIFTY 50", symbol: "^NSEI", value: parseFloat((22185.6 + jitter()).toFixed(2)), change: parseFloat((125.3 + jitter()).toFixed(2)), changePercent: 0.57 },
    { name: "SENSEX", symbol: "^BSESN", value: parseFloat((73256.8 + jitter() * 3).toFixed(2)), change: parseFloat((412.4 + jitter() * 3).toFixed(2)), changePercent: 0.57 },
    { name: "NIFTY BANK", symbol: "^NSEBANK", value: parseFloat((47892.4 + jitter()).toFixed(2)), change: parseFloat((-89.2 + jitter()).toFixed(2)), changePercent: -0.19 },
    { name: "NIFTY IT", symbol: "^CNXIT", value: parseFloat((34215.6 + jitter()).toFixed(2)), change: parseFloat((-234.5 + jitter()).toFixed(2)), changePercent: -0.68 },
  ];
}
