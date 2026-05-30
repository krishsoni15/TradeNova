"use client";

import { usePositions } from "@/hooks/use-positions";
import { Target, TrendingUp, TrendingDown, RefreshCw, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercentage } from "@/lib/constants";
import { Button } from "@/components/ui/button";

/**
 * PositionsPage — clean, professional active portfolio positions terminal.
 * Dynamically displays F&O options and Equity positions in near real-time.
 */
export default function PositionsPage() {
  const { data: positions, isLoading, isRefetching, refetch } = usePositions();

  const totalPnl = positions?.reduce((sum, p) => sum + p.pnl, 0) ?? 0;
  const isOverallProfit = totalPnl >= 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Active Positions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {positions?.length ?? 0} active F&O and intraday trades
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="gap-1.5 h-8 text-xs bg-card hover:bg-accent/40"
        >
          <RefreshCw className={cn("h-3 w-3", isRefetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Summary Banner */}
      {!isLoading && positions && positions.length > 0 && (
        <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Realised/Unrealised P&L</span>
            <div className={cn("text-2xl font-bold mt-1 tabular-nums", isOverallProfit ? "text-profit" : "text-loss")}>
              {isOverallProfit ? "+" : ""}{formatCurrency(totalPnl)}
            </div>
          </div>
          <span className={cn(
            "text-xs font-bold px-2.5 py-1 rounded-full border",
            isOverallProfit ? "bg-profit/10 text-profit border-profit/20" : "bg-loss/10 text-loss border-loss/20"
          )}>
            {isOverallProfit ? "PROFITABLE" : "OVERALL LOSS"}
          </span>
        </div>
      )}

      {/* Positions list */}
      <div className="grid grid-cols-1 gap-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-card/40 border border-border/30 animate-pulse" />
          ))
        ) : !positions || positions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-border/40 rounded-xl bg-card/20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">No Active Positions</h3>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Any F&O or equity positions you execute on Upstox will appear here in real-time.
            </p>
          </div>
        ) : (
          positions.map((p) => {
            const isProfit = p.pnl >= 0;
            return (
              <div
                key={p.symbol}
                className="bg-card/50 border border-border/40 rounded-xl p-5 flex flex-wrap gap-4 items-center justify-between hover:border-border/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{p.symbol}</span>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none uppercase",
                      p.type === "CALL" 
                        ? "text-profit border-profit/30 bg-profit/10" 
                        : p.type === "PUT" 
                        ? "text-loss border-loss/30 bg-loss/10" 
                        : "text-muted-foreground border-border/40 bg-muted/30"
                    )}>
                      {p.type}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5 font-medium">
                    Qty: <span className="tabular-nums font-semibold text-foreground/90">{p.qty}</span> • Avg: <span className="tabular-nums">{formatCurrency(p.avgPrice)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground font-mono">
                    LTP: <span className="font-semibold text-foreground tabular-nums">{formatCurrency(p.ltp)}</span>
                  </div>
                  <div className={cn("flex items-center justify-end gap-1 text-sm font-bold tabular-nums mt-1", isProfit ? "text-profit" : "text-loss")}>
                    {isProfit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {isProfit ? "+" : ""}{formatCurrency(p.pnl)} ({formatPercentage(p.pnlPct)})
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
