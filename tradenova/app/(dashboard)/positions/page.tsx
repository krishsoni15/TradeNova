"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_POSITIONS = [
  { symbol: "NIFTY25MAY22000CE", type: "CALL", qty: 50, avgPrice: 120.5, ltp: 195.3, pnl: 3740, pnlPct: 62.1 },
  { symbol: "BANKNIFTY25MAY48000PE", type: "PUT", qty: 25, avgPrice: 280.0, ltp: 245.6, pnl: -860, pnlPct: -12.3 },
  { symbol: "RELIANCE", type: "EQ", qty: 10, avgPrice: 2650.0, ltp: 2678.35, pnl: 283.5, pnlPct: 1.07 },
];

export default function PositionsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" /> Positions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Your active intraday and F&O positions</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-3">
        {MOCK_POSITIONS.map((p, i) => {
          const isProfit = p.pnl >= 0;
          return (
            <motion.div
              key={p.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card/50 border border-border/50 rounded-xl p-5 flex flex-wrap gap-4 items-center justify-between hover:border-border transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{p.symbol}</span>
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", p.type === "CALL" ? "text-profit border-profit/30 bg-profit/10" : p.type === "PUT" ? "text-loss border-loss/30 bg-loss/10" : "text-muted-foreground border-border/50 bg-muted/30")}>{p.type}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Qty: {p.qty} • Avg: ₹{p.avgPrice.toLocaleString("en-IN")}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold tabular-nums text-foreground">LTP: ₹{p.ltp.toLocaleString("en-IN")}</div>
                <div className={cn("flex items-center justify-end gap-1 text-sm font-bold tabular-nums mt-0.5", isProfit ? "text-profit" : "text-loss")}>
                  {isProfit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {isProfit ? "+" : ""}₹{p.pnl.toLocaleString("en-IN")} ({isProfit ? "+" : ""}{p.pnlPct.toFixed(2)}%)
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
