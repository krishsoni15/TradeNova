"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

const MOCK_ORDERS = [
  { id: "ORD-001", symbol: "RELIANCE", type: "BUY", qty: 5, price: 2655.0, status: "COMPLETE", time: "09:15 AM" },
  { id: "ORD-002", symbol: "TCS", type: "SELL", qty: 2, price: 3810.0, status: "COMPLETE", time: "10:32 AM" },
  { id: "ORD-003", symbol: "HDFCBANK", type: "BUY", qty: 10, price: 1688.0, status: "PENDING", time: "11:04 AM" },
  { id: "ORD-004", symbol: "INFY", type: "SELL", qty: 5, price: 1430.0, status: "REJECTED", time: "11:45 AM" },
  { id: "ORD-005", symbol: "ICICIBANK", type: "BUY", qty: 20, price: 1085.0, status: "COMPLETE", time: "12:10 PM" },
];

const StatusBadge = ({ status }: { status: string }) => {
  const cfg: Record<string, { color: string; icon: React.ReactNode }> = {
    COMPLETE: { color: "bg-profit/10 text-profit border-profit/20", icon: <CheckCircle2 className="w-3 h-3" /> },
    PENDING: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Clock className="w-3 h-3" /> },
    REJECTED: { color: "bg-loss/10 text-loss border-loss/20", icon: <XCircle className="w-3 h-3" /> },
  };
  const c = cfg[status] ?? cfg.PENDING;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${c.color}`}>
      {c.icon}{status}
    </span>
  );
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ArrowLeftRight className="w-6 h-6 text-primary" /> Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Today&apos;s order history from your Upstox account</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 border border-border/50 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Order ID</th>
                <th className="text-left px-5 py-3">Symbol</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-right px-5 py-3">Qty</th>
                <th className="text-right px-5 py-3">Price</th>
                <th className="text-right px-5 py-3">Value</th>
                <th className="text-center px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/20 hover:bg-white/3 transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{o.id}</td>
                  <td className="px-5 py-3.5 font-bold text-foreground">{o.symbol}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${o.type === "BUY" ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}`}>
                      {o.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{o.qty}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">₹{o.price.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-semibold">₹{(o.qty * o.price).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3.5 text-center"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3.5 text-right text-muted-foreground font-mono text-xs">{o.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
