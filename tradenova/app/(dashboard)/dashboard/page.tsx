"use client";

import { motion } from "framer-motion";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { HoldingsSkeleton } from "@/components/dashboard/holdings-skeleton";
import { IndicesBar } from "@/components/dashboard/market-ticker";
import { useHoldings } from "@/hooks/use-holdings";
import { useMarketQuotes } from "@/hooks/use-market-data";
import { WATCHLIST_SYMBOLS } from "@/services/market.service";
import { RefreshCw, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Holding } from "@/types/holdings";

/**
 * Dashboard — clean, focused overview
 * Shows: Market indices, portfolio summary, top movers, quick holdings
 */
export default function DashboardPage() {
  const { data, isLoading, isRefetching, refetch } = useHoldings();
  const { quotes, isLoading: quotesLoading, lastUpdated } = useMarketQuotes(WATCHLIST_SYMBOLS);

  // Sort properly: gainers = highest positive %, losers = most negative %
  const gainers = [...quotes].filter(q => q.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...quotes].filter(q => q.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);

  // Top 5 holdings by value for quick view
  const topHoldings: Holding[] = data?.holdings
    ? [...data.holdings].sort((a, b) => b.current_value - a.current_value).slice(0, 5)
    : [];

  return (
    <div className="space-y-5">
      {/* Header — simple */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en-IN")}` : "Loading..."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="gap-1.5 h-8 text-xs"
        >
          <RefreshCw className={cn("h-3 w-3", isRefetching && "animate-spin")} />
          Refresh
        </Button>
      </motion.div>

      {/* Market Indices */}
      <IndicesBar />

      {/* Portfolio Summary */}
      {isLoading ? (
        <HoldingsSkeleton />
      ) : data ? (
        <>
          <PortfolioSummary summary={data.summary} />

          {/* Market Movers + Quick Holdings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top Gainers */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/60 border border-border/40 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-profit" />
                <h2 className="text-sm font-semibold">Top Gainers</h2>
              </div>
              <div className="space-y-1">
                {quotesLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-9 rounded bg-muted/20 animate-pulse" />
                    ))
                  : gainers.length === 0 
                    ? <p className="text-xs text-muted-foreground py-2">No gainers right now</p>
                    : gainers.map((q) => (
                      <div key={q.symbol} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent/20 transition-colors">
                        <div>
                          <div className="text-sm font-medium text-foreground">{q.symbol}</div>
                          <div className="text-[11px] text-muted-foreground tabular-nums">₹{q.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                        </div>
                        <span className="text-xs font-bold text-profit tabular-nums">+{q.changePercent.toFixed(2)}%</span>
                      </div>
                    ))}
              </div>
            </motion.div>

            {/* Top Losers */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card/60 border border-border/40 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-loss" />
                <h2 className="text-sm font-semibold">Top Losers</h2>
              </div>
              <div className="space-y-1">
                {quotesLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-9 rounded bg-muted/20 animate-pulse" />
                    ))
                  : losers.length === 0
                    ? <p className="text-xs text-muted-foreground py-2">No losers right now</p>
                    : losers.map((q) => (
                      <div key={q.symbol} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent/20 transition-colors">
                        <div>
                          <div className="text-sm font-medium text-foreground">{q.symbol}</div>
                          <div className="text-[11px] text-muted-foreground tabular-nums">₹{q.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                        </div>
                        <span className="text-xs font-bold text-loss tabular-nums">{q.changePercent.toFixed(2)}%</span>
                      </div>
                    ))}
              </div>
            </motion.div>

            {/* Quick Holdings View */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card/60 border border-border/40 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold">Your Holdings</h2>
              </div>
              <div className="space-y-1">
                {topHoldings.length === 0
                  ? <p className="text-xs text-muted-foreground py-2">No holdings yet</p>
                  : topHoldings.map((h) => {
                    const isUp = h.pnl >= 0;
                    return (
                      <div key={h.tradingsymbol} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent/20 transition-colors">
                        <div>
                          <div className="text-sm font-medium text-foreground">{h.tradingsymbol}</div>
                          <div className="text-[11px] text-muted-foreground tabular-nums">{h.quantity} shares</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium tabular-nums">₹{h.current_value.toLocaleString("en-IN", { minimumFractionDigits: 0 })}</div>
                          <div className={cn("text-[11px] font-semibold tabular-nums", isUp ? "text-profit" : "text-loss")}>
                            {isUp ? "+" : ""}{h.pnl_percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <HoldingsSkeleton />
      )}
    </div>
  );
}
