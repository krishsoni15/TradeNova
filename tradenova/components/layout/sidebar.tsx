"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";
import { useSidebar } from "@/hooks/use-sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useMarketQuotes } from "@/hooks/use-market-data";

/**
 * Desktop sidebar navigation
 * Collapsible to icon-only mode with pure CSS transitions (no framer-motion dependencies)
 */
export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { connectionType } = useMarketQuotes([]); // Just to track global status

  const statusLabel = connectionType === "yahoo" 
    ? "Market Live" 
    : connectionType === "simulated" 
    ? "Simulated Live" 
    : "Market Offline";
    
  const statusSub = connectionType === "yahoo" 
    ? "Yahoo Finance" 
    : connectionType === "simulated" 
    ? "Simulated Feed" 
    : "Connecting...";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border/50 bg-sidebar lg:flex",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo + collapse toggle */}
      <div className="flex h-16 items-center justify-between px-4">
        <Logo collapsed={isCollapsed} />
        <button
          onClick={toggleCollapse}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground",
            "hover:bg-accent hover:text-foreground transition-colors",
            isCollapsed && "mx-auto"
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      <Separator className="opacity-50" />

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          const navContent = (
            <Link
              key={item.href}
              href={item.active ? item.href : "#"}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary ring-1 ring-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                !item.active && "opacity-50 cursor-not-allowed",
                isCollapsed && "justify-center px-2"
              )}
            >
              {/* Icon */}
              <item.icon
                className={cn(
                  "relative z-10 h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )}
              />

              {/* Label — hidden when collapsed */}
              {!isCollapsed && (
                <span className="relative z-10 truncate animate-fade-in">
                  {item.title}
                </span>
              )}

              {/* Badge (e.g. "Soon") */}
              {!isCollapsed && item.badge && (
                <Badge
                  variant="secondary"
                  className="relative z-10 ml-auto text-[10px] px-1.5 py-0"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );

          // Wrap in tooltip when collapsed
          if (isCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger>
                  {navContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.title}
                  {item.badge && (
                    <span className="ml-2 text-muted-foreground">
                      ({item.badge})
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          }

          return navContent;
        })}
      </nav>

      <Separator className="opacity-50" />

      {/* Bottom — connection status */}
      <div className="px-3 py-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 glass",
            isCollapsed && "justify-center px-2"
          )}
        >
          <div className="relative">
            <Zap className={cn("h-4 w-4", connectionType === "yahoo" ? "text-profit" : "text-primary")} />
            <span className={cn(
              "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full animate-pulse",
              connectionType === "yahoo" ? "bg-profit" : connectionType === "simulated" ? "bg-primary" : "bg-muted-foreground"
            )} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {statusLabel}
              </p>
              <p className="truncate text-[11px] text-muted-foreground font-mono">
                {statusSub}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
