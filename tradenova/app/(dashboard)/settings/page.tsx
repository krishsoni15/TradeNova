"use client";

import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Key, Globe, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    title: "Account",
    icon: User,
    items: [
      { label: "Profile & KYC", desc: "Manage your personal details and KYC status", href: "#" },
      { label: "Linked Broker", desc: "Upstox account connected via OAuth", href: "#", badge: "Connected" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Price Alerts", desc: "Get notified when stocks hit your target", href: "#" },
      { label: "Portfolio Alerts", desc: "Daily P&L summary emails", href: "#" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    items: [
      { label: "API Keys", desc: "Manage your Upstox API credentials", href: "#" },
      { label: "Session Management", desc: "View and revoke active sessions", href: "#" },
    ],
  },
  {
    title: "App",
    icon: Globe,
    items: [
      { label: "Theme", desc: "Dark mode (Trading Terminal default)", href: "#" },
      { label: "Data Source", desc: "Yahoo Finance + Upstox API", href: "#" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your TradeNova account and preferences</p>
      </motion.div>

      <div className="space-y-4">
        {SECTIONS.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
            className="bg-card/50 border border-border/50 rounded-xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/30 bg-muted/20">
              <section.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{section.title}</span>
            </div>
            <div className="divide-y divide-border/20">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-accent/20 transition-colors text-left group"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-profit/10 text-profit border border-profit/20">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
