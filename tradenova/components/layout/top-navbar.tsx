"use client";

import { Menu, Bell, Search, CircleDot } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * Top navigation bar
 * Contains mobile menu trigger, search placeholder, notifications, and user menu
 */
export function TopNavbar() {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={toggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Search bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stocks, ETFs..."
            className="w-full h-9 rounded-lg bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 border border-transparent focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border/60 bg-muted/70 px-1.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Market status indicator */}
        <div className="hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5 glass text-xs">
          <CircleDot className="h-3 w-3 text-primary animate-pulse-soft" />
          <span className="font-medium text-foreground">NSE</span>
          <span className="text-muted-foreground">Live</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4.5 w-4.5 text-muted-foreground" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
                  KR
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">Krish</p>
              <p className="text-xs text-muted-foreground">krish@tradenova.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
