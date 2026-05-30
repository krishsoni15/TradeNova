"use client";

import { FileText, ArrowUpRight, ArrowDownLeft, CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MOCK_ORDERS = [
  { id: "ORD001", symbol: "RELIANCE", type: "BUY", qty: 10, price: 2650.0, status: "COMPLETED", time: "11:20 AM" },
  { id: "ORD002", symbol: "TCS", type: "SELL", qty: 5, price: 3795.5, status: "COMPLETED", time: "10:15 AM" },
  { id: "ORD003", symbol: "NIFTY26JUN23000CE", type: "BUY", qty: 50, price: 120.5, status: "COMPLETED", time: "09:30 AM" },
  { id: "ORD004", symbol: "BANKNIFTY26JUN49000PE", type: "BUY", qty: 25, price: 280.0, status: "COMPLETED", time: "09:28 AM" },
  { id: "ORD005", symbol: "WIPRO", type: "BUY", qty: 30, price: 450.0, status: "REJECTED", time: "09:15 AM" },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" /> Order Book
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Historical record of executions and requests in the current session.
        </p>
      </div>

      <div className="bg-card/50 border border-border/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">
                <th className="p-4">Time</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Action</th>
                <th className="p-4 text-right">Qty</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-sm">
              {MOCK_ORDERS.map((o) => {
                const isBuy = o.type === "BUY";
                const isCompleted = o.status === "COMPLETED";

                return (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-muted-foreground font-medium">{o.time}</td>
                    <td className="p-4 font-bold text-foreground">{o.symbol}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border",
                        isBuy ? "text-profit border-profit/30 bg-profit/10" : "text-loss border-loss/30 bg-loss/10"
                      )}>
                        {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                        {o.type}
                      </span>
                    </td>
                    <td className="p-4 text-right font-semibold tabular-nums">{o.qty}</td>
                    <td className="p-4 text-right font-mono tabular-nums">{formatCurrency(o.price)}</td>
                    <td className="p-4 text-right">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-semibold",
                        isCompleted ? "text-profit" : "text-loss"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {o.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
