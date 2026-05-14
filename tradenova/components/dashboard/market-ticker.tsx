"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarketQuotes, useMarketIndices } from "@/hooks/use-market-data";
import { WATCHLIST_SYMBOLS } from "@/services/market.service";

/**
 * Compact scrolling stock ticker in the layout
 */
export function MarketTicker() {
  const { quotes } = useMarketQuotes(WATCHLIST_SYMBOLS);
  const items = [...quotes, ...quotes];

  if (items.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-card/30 border-b border-border/20 h-8 flex items-center">
      <div className="flex shrink-0 gap-0 animate-marquee whitespace-nowrap">
        {items.map((q, i) => {
          const isUp = q.changePercent >= 0;
          return (
            <span key={`${q.symbol}-${i}`} className="inline-flex items-center gap-1.5 px-4 border-r border-border/15 text-[11px] font-mono shrink-0">
              <span className="font-medium text-foreground/80">{q.symbol}</span>
              <span className={cn("font-semibold tabular-nums", isUp ? "text-profit" : "text-loss")}>
                ₹{q.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={cn("text-[10px] tabular-nums", isUp ? "text-profit/70" : "text-loss/70")}>
                {isUp ? "+" : ""}{q.changePercent.toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Market Indices Bar — Nifty, Sensex, Bank Nifty, IT
 */
export function IndicesBar() {
  const { indices } = useMarketIndices();

  if (indices.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {indices.map((idx) => {
        const isUp = idx.changePercent >= 0;
        return (
          <div
            key={idx.name}
            className="bg-card/60 border border-border/40 rounded-xl px-4 py-3"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{idx.name}</span>
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", isUp ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss")}>
                {isUp ? "▲" : "▼"} {Math.abs(idx.changePercent).toFixed(2)}%
              </span>
            </div>
            <span className="text-lg font-bold tabular-nums text-foreground">
              {idx.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className={cn("text-[11px] tabular-nums font-medium", isUp ? "text-profit" : "text-loss")}>
              {isUp ? "+" : ""}{idx.change.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
