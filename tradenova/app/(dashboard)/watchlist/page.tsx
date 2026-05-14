"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, TrendingUp, TrendingDown, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarketQuotes } from "@/hooks/use-market-data";

const DEFAULT_WATCHLIST = ["RELIANCE", "TCS", "HDFCBANK", "ICICIBANK", "INFY", "BHARTIARTL", "MARUTI", "SUNPHARMA"];

export default function WatchlistPage() {
  const [symbols, setSymbols] = useState(DEFAULT_WATCHLIST);
  const [newSymbol, setNewSymbol] = useState("");
  const { quotes, isLoading, lastUpdated } = useMarketQuotes(symbols);

  const addSymbol = () => {
    const s = newSymbol.trim().toUpperCase();
    if (s && !symbols.includes(s)) {
      setSymbols((prev) => [...prev, s]);
      setNewSymbol("");
    }
  };

  const removeSymbol = (sym: string) => setSymbols((prev) => prev.filter((s) => s !== sym));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" /> Watchlist
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {symbols.length} stocks • {lastUpdated ? `Live • ${lastUpdated.toLocaleTimeString("en-IN")}` : "Loading..."}
        </p>
      </motion.div>

      {/* Add stock */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && addSymbol()}
          placeholder="Add symbol (e.g. WIPRO)"
          className="flex-1 max-w-xs h-10 rounded-xl bg-muted/30 px-4 text-sm border border-border/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground/60"
        />
        <button
          onClick={addSymbol}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Watchlist cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
            ))
          : quotes.map((q, i) => {
              const isUp = q.changePercent >= 0;
              return (
                <motion.div
                  key={q.symbol}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "relative group bg-card/50 border rounded-xl p-4 hover:shadow-lg transition-all cursor-default",
                    isUp ? "border-profit/20 hover:border-profit/40" : "border-loss/20 hover:border-loss/40"
                  )}
                >
                  <button
                    onClick={() => removeSymbol(q.symbol)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-loss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground">{q.symbol}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">NSE</div>
                    </div>
                    <div className={cn("text-xs font-bold px-2 py-1 rounded-full", isUp ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss")}>
                      {isUp ? "+" : ""}{q.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <div className="text-xl font-bold tabular-nums text-foreground">
                      ₹{q.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-semibold tabular-nums", isUp ? "text-profit" : "text-loss")}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isUp ? "+" : ""}₹{q.change.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground font-mono">
                    H: ₹{q.high.toFixed(2)} • L: ₹{q.low.toFixed(2)} • Vol: {(q.volume / 1_000_000).toFixed(1)}M
                  </div>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}
