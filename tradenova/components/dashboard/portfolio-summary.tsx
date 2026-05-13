"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  PieChart,
  BarChart3,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercentage } from "@/lib/constants";
import type { PortfolioSummary as PortfolioSummaryType } from "@/types/holdings";

/**
 * Portfolio summary cards
 * Four glassmorphism cards with staggered entrance animation
 * Shows: Total Investment, Current Value, Total P&L, Day's P&L
 */

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

/** Animation variants for stagger effect */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

/** Individual summary card data */
interface CardData {
  title: string;
  value: number;
  subValue?: number;
  icon: typeof TrendingUp;
  showPnl: boolean;
  pnlValue?: number;
}

export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  const cards: CardData[] = [
    {
      title: "Total Investment",
      value: summary.total_investment,
      icon: IndianRupee,
      showPnl: false,
    },
    {
      title: "Current Value",
      value: summary.current_value,
      icon: PieChart,
      showPnl: false,
    },
    {
      title: "Total P&L",
      value: summary.total_pnl,
      icon: BarChart3,
      showPnl: true,
      pnlValue: summary.total_pnl_percentage,
    },
    {
      title: "Day's P&L",
      value: summary.day_pnl,
      icon: Activity,
      showPnl: true,
      pnlValue: summary.day_pnl_percentage,
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => {
        const isProfit = card.showPnl ? card.value >= 0 : true;
        const TrendIcon = isProfit ? TrendingUp : TrendingDown;

        return (
          <motion.div key={card.title} variants={item}>
            <Card
              className={cn(
                "group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300",
                "hover:border-border hover:bg-card/80 hover:shadow-lg",
                card.showPnl && isProfit && "hover:shadow-primary/5",
                card.showPnl && !isProfit && "hover:shadow-destructive/5"
              )}
            >
              {/* Subtle gradient overlay */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  card.showPnl && isProfit && "bg-gradient-to-br from-primary/5 to-transparent",
                  card.showPnl && !isProfit && "bg-gradient-to-br from-destructive/5 to-transparent",
                  !card.showPnl && "bg-gradient-to-br from-primary/3 to-transparent"
                )}
              />

              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  {/* Title + Value */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {card.title}
                    </p>
                    <p
                      className={cn(
                        "text-2xl font-bold tracking-tight tabular-nums",
                        card.showPnl
                          ? isProfit
                            ? "text-profit"
                            : "text-loss"
                          : "text-foreground"
                      )}
                    >
                      {formatCurrency(card.value)}
                    </p>
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      card.showPnl && isProfit && "bg-profit-bg text-profit",
                      card.showPnl && !isProfit && "bg-loss-bg text-loss",
                      !card.showPnl && "bg-primary/10 text-primary"
                    )}
                  >
                    <card.icon className="h-5 w-5" />
                  </div>
                </div>

                {/* P&L percentage badge */}
                {card.showPnl && card.pnlValue !== undefined && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <div
                      className={cn(
                        "flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
                        isProfit
                          ? "bg-profit-bg text-profit"
                          : "bg-loss-bg text-loss"
                      )}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {formatPercentage(card.pnlValue)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {card.title === "Day's P&L" ? "today" : "overall"}
                    </span>
                  </div>
                )}

                {/* Holdings count for investment card */}
                {card.title === "Total Investment" && (
                  <div className="mt-3">
                    <span className="text-xs text-muted-foreground">
                      Across{" "}
                      <span className="font-medium text-foreground">
                        {summary.total_holdings}
                      </span>{" "}
                      stocks
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
