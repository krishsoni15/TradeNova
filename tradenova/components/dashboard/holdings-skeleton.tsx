"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Holdings skeleton loader
 * Matches the exact layout of portfolio summary cards + holdings table
 * Provides a premium shimmer loading experience
 */
export function HoldingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-36" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-3 w-10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Holdings table skeleton */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Table header skeleton */}
          <div className="flex items-center gap-4 border-b border-border/50 px-6 py-3">
            {["Stock", "Qty", "Avg Cost", "LTP", "Value", "P&L", "Day"].map(
              (label) => (
                <Skeleton
                  key={label}
                  className="h-3 flex-1"
                  style={{ maxWidth: label === "Stock" ? 120 : 80 }}
                />
              )
            )}
          </div>

          {/* Table rows skeleton */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-border/30 px-6 py-4"
            >
              <div className="flex-1 max-w-[120px] space-y-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-4 w-8 flex-1 max-w-[80px]" />
              <Skeleton className="h-4 w-16 flex-1 max-w-[80px]" />
              <Skeleton className="h-4 w-16 flex-1 max-w-[80px]" />
              <Skeleton className="h-4 w-20 flex-1 max-w-[80px]" />
              <div className="flex-1 max-w-[80px] space-y-1">
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-3 w-12 ml-auto" />
              </div>
              <Skeleton className="h-6 w-16 rounded-md flex-1 max-w-[80px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
