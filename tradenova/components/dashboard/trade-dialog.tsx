"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TradeDialog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tradeSymbol = searchParams.get("trade");
  const [isOpen, setIsOpen] = useState(false);
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (tradeSymbol) {
      setIsOpen(true);
      setOrderPlaced(false);
      fetchLivePrice(tradeSymbol);
    } else {
      setIsOpen(false);
    }
  }, [tradeSymbol]);

  const fetchLivePrice = async (symbol: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Find exact match or first
        const match = data.results.find((s: any) => s.symbol === symbol) || data.results[0];
        setStockData(match);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    router.push("/dashboard");
    setTimeout(() => {
      setStockData(null);
      setQty(1);
    }, 300);
  };

  const executeTrade = (type: "BUY" | "SELL") => {
    // Simulate API call to Upstox Place Order API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[400px]">
        {!orderPlaced ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                {tradeSymbol} <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">NSE</span>
              </DialogTitle>
              <DialogDescription>
                {stockData?.displayName || "Loading real-time data..."}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-6">
              {/* Live Price Display */}
              <div className="p-4 rounded-xl border border-border/50 bg-accent/20 flex flex-col items-center justify-center">
                {loading && !stockData ? (
                  <div className="h-8 w-24 bg-muted/50 animate-pulse rounded" />
                ) : (
                  <>
                    <div className="text-3xl font-bold tabular-nums">
                      ₹{stockData?.price?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}
                    </div>
                    <div className={cn("text-sm font-semibold mt-1", (stockData?.changePercent ?? 0) >= 0 ? "text-profit" : "text-loss")}>
                      {(stockData?.changePercent ?? 0) >= 0 ? "+" : ""}{(stockData?.changePercent ?? 0).toFixed(2)}%
                    </div>
                  </>
                )}
              </div>

              {/* Order Controls */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={() => setQty(Math.max(1, qty - 1))}>-</Button>
                  <div className="flex-1 text-center font-semibold text-lg tabular-nums">{qty}</div>
                  <Button variant="outline" size="icon" onClick={() => setQty(qty + 1)}>+</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/40">
                <span>Margin Required</span>
                <span className="font-semibold text-foreground">
                  ₹{((stockData?.price || 0) * qty).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <Button 
                onClick={() => executeTrade("SELL")} 
                disabled={loading || !stockData} 
                className="flex-1 bg-loss hover:bg-loss/90 text-white font-bold"
              >
                SELL
              </Button>
              <Button 
                onClick={() => executeTrade("BUY")} 
                disabled={loading || !stockData} 
                className="flex-1 bg-profit hover:bg-profit/90 text-white font-bold"
              >
                BUY
              </Button>
            </div>
          </>
        ) : (
          <div className="py-10 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="h-16 w-16 bg-profit/20 text-profit rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Order Placed!</h2>
            <p className="text-sm text-muted-foreground">Your simulated Upstox order for {qty} shares of {tradeSymbol} has been executed successfully.</p>
            <Button onClick={handleClose} className="mt-4 w-full" variant="outline">Back to Dashboard</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
