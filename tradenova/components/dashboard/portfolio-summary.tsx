"use client";

import { motion } from "framer-motion";
import { IndianRupee, PieChart, BarChart3, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercentage } from "@/lib/constants";
import type { PortfolioSummary as PortfolioSummaryType } from "@/types/holdings";

/**
 * Portfolio summary — 4 clean stat cards
 */
interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  const cards = [
    { title: "Invested", value: summary.total_investment, icon: IndianRupee, isPnl: false, sub: `${summary.total_holdings} stocks` },
    { title: "Current Value", value: summary.current_value, icon: PieChart, isPnl: false },
    { title: "Total P&L", value: summary.total_pnl, icon: BarChart3, isPnl: true, pct: summary.total_pnl_percentage },
    { title: "Day's P&L", value: summary.day_pnl, icon: Activity, isPnl: true, pct: summary.day_pnl_percentage },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card, i) => {
        const isProfit = card.value >= 0;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card/60 border border-border/40 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{card.title}</span>
              <card.icon className={cn("h-4 w-4", card.isPnl ? (isProfit ? "text-profit" : "text-loss") : "text-primary")} />
            </div>
            <p className={cn(
              "text-xl font-bold tabular-nums",
              card.isPnl ? (isProfit ? "text-profit" : "text-loss") : "text-foreground"
            )}>
              {formatCurrency(card.value)}
            </p>
            {card.isPnl && card.pct !== undefined && (
              <span className={cn("text-[11px] font-semibold tabular-nums", isProfit ? "text-profit/80" : "text-loss/80")}>
                {formatPercentage(card.pct)} {card.title === "Day's P&L" ? "today" : "overall"}
              </span>
            )}
            {card.sub && (
              <span className="text-[11px] text-muted-foreground">{card.sub}</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
