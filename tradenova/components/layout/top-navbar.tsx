"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, Search, CircleDot, LogIn } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { useMarketQuotes } from "@/hooks/use-market-data";
import { WATCHLIST_SYMBOLS } from "@/services/market.service";
import { Settings, Key, User, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Top navigation bar — clean, minimal design
 * Live search with real stock data from watchlist
 */
export function TopNavbar() {
  const { toggle } = useSidebar();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { quotes } = useMarketQuotes(WATCHLIST_SYMBOLS);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter stocks based on search query — uses REAL market data
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toUpperCase();
    if (!q || q.length < 1) return [];
    return quotes
      .filter((s) => s.symbol.includes(q) || s.displayName.toUpperCase().includes(q))
      .slice(0, 6);
  }, [searchQuery, quotes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/holdings?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchFocused(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/90 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile menu */}
      <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-8 w-8" onClick={toggle}>
        <Menu className="h-4 w-4" />
      </Button>

      {/* Search bar */}
      <div className="flex-1 max-w-md mx-auto">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search stocks..."
            className="w-full h-9 rounded-lg bg-muted/40 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 border border-border/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          />

          {/* Live search dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1.5 bg-card border border-border/50 shadow-xl rounded-lg overflow-hidden z-50">
              {searchResults.map((stock) => {
                const isUp = stock.changePercent >= 0;
                return (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      router.push(`/holdings?q=${encodeURIComponent(stock.symbol)}`);
                      setIsSearchFocused(false);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-accent/40 transition-colors text-left"
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground">{stock.symbol}</div>
                      <div className="text-[11px] text-muted-foreground">{stock.displayName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium tabular-nums">₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                      <div className={cn("text-[11px] font-semibold tabular-nums", isUp ? "text-profit" : "text-loss")}>
                        {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </form>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Market status */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted/30">
          <CircleDot className="h-2.5 w-2.5 text-profit animate-pulse" />
          <span className="font-medium">NSE</span>
        </div>

        {/* User menu / Login */}
        {mounted && !isAuthenticated ? (
          <Button onClick={() => router.push("/login")} variant="default" size="sm" className="h-8 gap-1.5 text-xs">
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Login</span>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-accent transition-colors cursor-pointer border border-border/40">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {user?.name?.slice(0, 2).toUpperCase() || "KR"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-lg">
              <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {user?.name?.slice(0, 2).toUpperCase() || "KR"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">{user?.name || "Krish Soni"}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{user?.email || "krish@tradenova.com"}</p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer rounded-md text-sm py-1.5">
                  <User className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer rounded-md text-sm py-1.5">
                  <Settings className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-destructive cursor-pointer rounded-md text-sm py-1.5" onClick={handleLogout}>
                <LogIn className="w-3.5 h-3.5 mr-2 rotate-180" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
