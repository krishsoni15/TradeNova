"use client";

import { Activity } from "lucide-react";
import { motion } from "framer-motion";

/**
 * TradeNova Logo component
 * Animated brand mark with gradient accent
 */
export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <motion.div
      className="flex items-center gap-2.5"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo icon — pulsing activity indicator */}
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
        <Activity className="h-5 w-5 text-primary" />
        {/* Subtle glow behind icon */}
        <div className="absolute inset-0 rounded-lg bg-primary/10 blur-md" />
      </div>

      {/* Brand text — hidden when sidebar is collapsed */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <span className="text-lg font-bold tracking-tight text-foreground">
            Trade
          </span>
          <span className="text-lg font-bold tracking-tight text-primary">
            Nova
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
