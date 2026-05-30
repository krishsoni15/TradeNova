"use client";

import { Suspense } from "react";
import { TradeDialog } from "@/components/dashboard/trade-dialog";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { HoldingsSkeleton } from "@/components/dashboard/holdings-skeleton";
import { useHoldings } from "@/hooks/use-holdings";
import { RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Holding } from "@/types/holdings";

/**
 * Dashboard — clean, focused overview
 * Shows: Portfolio summary and holdings
 */
export default function DashboardPage() {
  const { data, isLoading, isRefetching, refetch } = useHoldings();

  // All holdings sorted by value
  const holdings: Holding[] = data?.holdings
    ? [...data.holdings].sort((a, b) => b.current_value - a.current_value)
    : [];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header — simple */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your portfolio overview
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
      </div>

      {/* Portfolio Summary */}
      {isLoading ? (
        <HoldingsSkeleton />
      ) : data ? (
        <>
          <PortfolioSummary summary={data.summary} />

          {/* Holdings View */}
          <div className="bg-card/60 border border-border/40 rounded-xl p-4 transition-all hover:border-border/60">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Your Holdings</h2>
            </div>
            <div className="space-y-2">
              {holdings.length === 0
                ? <p className="text-sm text-muted-foreground py-4 text-center">No holdings yet</p>
                : holdings.map((h) => {
                    const isUp = h.pnl >= 0;
                    return (
                      <div key={h.tradingsymbol} className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent/10 hover:bg-accent/30 transition-colors border border-border/20">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground">{h.tradingsymbol}</span>
                          <span className="text-xs text-muted-foreground">{h.quantity} shares @ ₹{h.average_price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold tabular-nums">₹{h.current_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                          <div className={cn("text-xs font-semibold tabular-nums mt-0.5", isUp ? "text-profit" : "text-loss")}>
                            {isUp ? "+" : ""}₹{Math.abs(h.pnl).toLocaleString("en-IN", { minimumFractionDigits: 2 })} ({isUp ? "+" : ""}{h.pnl_percentage.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </>
      ) : (
        <HoldingsSkeleton />
      )}
      
      {/* Trade Terminal Dialog */}
      <Suspense fallback={null}>
        <TradeDialog />
      </Suspense>
    </div>
  );
}
