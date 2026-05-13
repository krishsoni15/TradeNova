"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";
import { useSidebar } from "@/hooks/use-sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Zap } from "lucide-react";

/**
 * Mobile navigation drawer
 * shadcn Sheet-based sidebar for mobile viewports
 */
export function MobileNav() {
  const pathname = usePathname();
  const { isOpen, setOpen } = useSidebar();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72 bg-sidebar p-0">
        <SheetHeader className="h-16 flex flex-row items-center px-4 border-b border-border/50">
          <SheetTitle className="flex items-center">
            <Logo />
          </SheetTitle>
        </SheetHeader>

        {/* Navigation items */}
        <nav className="space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.active ? item.href : "#"}
                onClick={() => item.active && setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary ring-1 ring-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  !item.active && "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="ml-auto text-[10px] px-1.5 py-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <Separator className="opacity-50" />

        {/* Connection status */}
        <div className="px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 glass">
            <div className="relative">
              <Zap className="h-4 w-4 text-primary" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                Market Ready
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Upstox Connected
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
