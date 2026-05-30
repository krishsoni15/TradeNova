"use client";

import { Activity } from "lucide-react";

/**
 * TradeNova Logo component
 * Clean brand mark with gradient accent
 */
export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 animate-fade-in">
      {/* Logo icon */}
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
        <Activity className="h-5 w-5 text-primary" />
        <div className="absolute inset-0 rounded-lg bg-primary/10 blur-md" />
      </div>

      {/* Brand text — hidden when sidebar is collapsed */}
      {!collapsed && (
        <div className="overflow-hidden">
          <span className="text-lg font-bold tracking-tight text-foreground">
            Trade
          </span>
          <span className="text-lg font-bold tracking-tight text-primary">
            Nova
          </span>
        </div>
      )}
    </div>
  );
}
