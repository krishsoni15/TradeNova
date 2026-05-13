"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

/**
 * Dashboard layout
 * Provides the sidebar + top navbar shell for all dashboard pages
 * Responsive: sidebar collapses to sheet on mobile
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <div className="relative flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile navigation drawer */}
      <MobileNav />

      {/* Main content area — shifts based on sidebar width */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          "lg:ml-[260px]",
          sidebarCollapsed && "lg:ml-[72px]"
        )}
      >
        {/* Top navigation bar */}
        <TopNavbar />

        {/* Page content */}
        <ScrollArea className="flex-1">
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
