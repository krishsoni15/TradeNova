"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { HoldingsTable } from "@/components/dashboard/holdings-table";
import { HoldingsSkeleton } from "@/components/dashboard/holdings-skeleton";
import { useHoldings } from "@/hooks/use-holdings";
import { RefreshCw, Search, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Holding } from "@/types/holdings";

export default function HoldingsPage() {
  return (
    <Suspense fallback={<HoldingsSkeleton />}>
      <HoldingsPageContent />
    </Suspense>
  );
}

function HoldingsPageContent() {
  const { data, isLoading, isRefetching, refetch } = useHoldings();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [filterGain, setFilterGain] = useState<"all" | "profit" | "loss">("all");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  // Filtered holdings
  const filtered = useMemo<Holding[]>(() => {
    if (!data?.holdings) return [];
    return data.holdings.filter((h) => {
      const matchesSearch =
        h.tradingsymbol.toLowerCase().includes(search.toLowerCase()) ||
        h.company_name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filterGain === "all" ||
        (filterGain === "profit" && h.pnl >= 0) ||
        (filterGain === "loss" && h.pnl < 0);
      return matchesSearch && matchesFilter;
    });
  }, [data, search, filterGain]);

  const profitCount = data?.holdings.filter((h) => h.pnl >= 0).length ?? 0;
  const lossCount = data?.holdings.filter((h) => h.pnl < 0).length ?? 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-xl font-bold text-foreground">Holdings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {data?.holdings.length ?? "—"} stocks • {profitCount} gaining • {lossCount} losing
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

      {isLoading ? (
        <HoldingsSkeleton />
      ) : data ? (
        <>
          <PortfolioSummary summary={data.summary} />

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter holdings..."
                className="w-full h-9 rounded-lg bg-muted/30 pl-9 pr-4 text-sm border border-border/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="flex gap-1.5">
              {(["all", "profit", "loss"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterGain(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                    filterGain === f
                      ? f === "profit"
                        ? "bg-profit/10 border-profit/30 text-profit"
                        : f === "loss"
                        ? "bg-loss/10 border-loss/30 text-loss"
                        : "bg-primary/10 border-primary/30 text-primary"
                      : "bg-transparent border-border/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f === "all" ? "All" : f === "profit" ? (
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Gainers</span>
                  ) : (
                    <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Losers</span>
                  )}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-auto tabular-nums">{filtered.length} stocks</span>
          </div>

          <HoldingsTable holdings={filtered} />
        </>
      ) : (
        <HoldingsSkeleton />
      )}
    </div>
  );
}
