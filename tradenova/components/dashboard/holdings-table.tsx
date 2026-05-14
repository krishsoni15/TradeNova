"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Briefcase,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercentage } from "@/lib/constants";
import { EmptyState } from "@/components/shared/empty-state";
import type { Holding } from "@/types/holdings";

/**
 * Holdings data table
 * Professional trading terminal table with:
 * - Sortable columns
 * - Color-coded P&L
 * - Row hover effects
 * - Framer Motion row entrance
 * - Responsive design
 */

interface HoldingsTableProps {
  holdings: Holding[];
}

type SortField = "tradingsymbol" | "current_value" | "pnl" | "pnl_percentage" | "day_change_percentage";
type SortDirection = "asc" | "desc";

/** Animation variants for table rows */
const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
} satisfies import("framer-motion").Variants;

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("current_value");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  /** Toggle sort on column click */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  /** Sorted holdings */
  const sorted = [...holdings].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    const numA = Number(aVal);
    const numB = Number(bVal);
    return sortDirection === "asc" ? numA - numB : numB - numA;
  });

  /** Sortable column header */
  const SortableHeader = ({
    field,
    children,
    className,
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead
      className={cn(
        "cursor-pointer select-none whitespace-nowrap transition-colors hover:text-foreground",
        className
      )}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown
          className={cn(
            "h-3 w-3 text-muted-foreground/50 transition-colors",
            sortField === field && "text-primary"
          )}
        />
      </div>
    </TableHead>
  );

  if (holdings.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50">
        <EmptyState
          icon={Briefcase}
          title="No Holdings Found"
          description="Connect your Upstox account to view your portfolio holdings here."
        />
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Holdings
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {holdings.length} stocks in your portfolio
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            NSE
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <SortableHeader field="tradingsymbol">
                  Stock
                </SortableHeader>
                <TableHead className="text-right whitespace-nowrap">
                  Qty
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Avg Cost
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  LTP
                </TableHead>
                <SortableHeader
                  field="current_value"
                  className="text-right"
                >
                  Current Value
                </SortableHeader>
                <SortableHeader field="pnl" className="text-right">
                  P&L
                </SortableHeader>
                <SortableHeader
                  field="day_change_percentage"
                  className="text-right"
                >
                  Day Change
                </SortableHeader>
                <TableHead className="w-[80px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((holding, i) => {
                const isProfit = holding.pnl >= 0;
                const isDayProfit = holding.day_change >= 0;

                return (
                  <motion.tr
                    key={holding.tradingsymbol}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    className={cn(
                      "group border-border/30 transition-colors",
                      "hover:bg-white/5"
                    )}
                  >
                    {/* Stock name + symbol */}
                    <TableCell className="py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground">
                          {holding.tradingsymbol}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {holding.company_name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="text-right tabular-nums text-sm">
                      {holding.quantity}
                    </TableCell>

                    {/* Average cost */}
                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                      {formatCurrency(holding.average_price)}
                    </TableCell>

                    {/* Last traded price */}
                    <TableCell className="text-right tabular-nums text-sm font-medium">
                      {formatCurrency(holding.last_price)}
                    </TableCell>

                    {/* Current value */}
                    <TableCell className="text-right tabular-nums text-sm font-medium">
                      {formatCurrency(holding.current_value)}
                    </TableCell>

                    {/* P&L (absolute + percentage) */}
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={cn(
                            "flex items-center gap-1 text-sm font-semibold tabular-nums",
                            isProfit ? "text-profit" : "text-loss"
                          )}
                        >
                          {isProfit ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {formatCurrency(Math.abs(holding.pnl))}
                        </span>
                        <span
                          className={cn(
                            "text-[11px] tabular-nums",
                            isProfit ? "text-profit/80" : "text-loss/80"
                          )}
                        >
                          {formatPercentage(holding.pnl_percentage)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Day change */}
                    <TableCell className="text-right">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold tabular-nums",
                          isDayProfit
                            ? "bg-profit-bg text-profit"
                            : "bg-loss-bg text-loss"
                        )}
                      >
                        {isDayProfit ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {formatPercentage(holding.day_change_percentage)}
                      </div>
                    </TableCell>

                    {/* Quick Actions (visible on hover) */}
                    <TableCell className="text-right py-2">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-transparent border-profit/30 text-profit hover:bg-profit/10 hover:text-profit">
                          B
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-transparent border-loss/30 text-loss hover:bg-loss/10 hover:text-loss">
                          S
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
