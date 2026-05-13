"use client";

import { motion } from "framer-motion";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { HoldingsTable } from "@/components/dashboard/holdings-table";
import { HoldingsSkeleton } from "@/components/dashboard/holdings-skeleton";
import { useHoldings } from "@/hooks/use-holdings";
import { RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Dedicated Holdings page
 * Same data as dashboard but focused view with additional controls
 */
export default function HoldingsPage() {
  const { data, isLoading, isRefetching, refetch } = useHoldings();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Holdings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor your stock holdings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border/50 bg-card/50"
            disabled
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-1.5 border-border/50 bg-card/50"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                isRefetching && "animate-spin"
              )}
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <HoldingsSkeleton />
      ) : data ? (
        <div className="space-y-6">
          <PortfolioSummary summary={data.summary} />
          <HoldingsTable holdings={data.holdings} />
        </div>
      ) : (
        <HoldingsSkeleton />
      )}
    </div>
  );
}
