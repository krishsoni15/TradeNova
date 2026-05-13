"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

/**
 * Desktop sidebar navigation
 * Glassmorphism design with animated active states
 * Collapsible to icon-only mode
 */
export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border/50 bg-sidebar lg:flex",
        "transition-all duration-300 ease-in-out"
      )}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
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
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                !item.active && "opacity-50 cursor-not-allowed",
                isCollapsed && "justify-center px-2"
              )}
            >
              {/* Active indicator background */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-primary/15 ring-1 ring-primary/25"
                  layoutId="sidebar-active"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              {/* Icon */}
              <item.icon
                className={cn(
                  "relative z-10 h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )}
              />

              {/* Label — hidden when collapsed */}
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    className="relative z-10 truncate"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>

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
                <TooltipTrigger>{navContent}</TooltipTrigger>
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
            <Zap className="h-4 w-4 text-primary" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                Market Ready
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Upstox Connected
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
