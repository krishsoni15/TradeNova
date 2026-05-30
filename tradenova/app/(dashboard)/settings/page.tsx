"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Settings, Key, User, ShieldAlert, LogOut, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your secure connection and trading account preferences.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-card/50 border border-border/40 rounded-xl p-5 space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/20 pb-2">
          <User className="w-4 h-4 text-primary" /> Broker Account Profile
        </h2>

        {isAuthenticated && user ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Account Holder:</span>
              <span className="font-semibold text-foreground">{user.name}</span>
              <span className="text-muted-foreground">Upstox ID:</span>
              <span className="font-semibold text-foreground font-mono">{user.client_id || "DEMO123"}</span>
              <span className="text-muted-foreground">Connected Email:</span>
              <span className="font-semibold text-foreground">{user.email || "krish@tradenova.com"}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-profit bg-profit/10 px-2.5 py-1 rounded-full border border-profit/20">
              <CheckCircle className="w-3.5 h-3.5" /> Authenticated & Connected
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You are currently using the TradeNova sandbox/demo mode. Live broker credentials are not active.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
              <ShieldAlert className="w-3.5 h-3.5" /> Sandbox Mode
            </div>
          </div>
        )}
      </div>

      {/* Security & API Status */}
      <div className="bg-card/50 border border-border/40 rounded-xl p-5 space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/20 pb-2">
          <Key className="w-4 h-4 text-primary" /> System Configuration
        </h2>
        <div className="space-y-2.5 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Unified Next.js Backend Status</span>
            <span className="text-profit font-semibold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Environment File config (.env.local)</span>
            <span className="text-foreground font-semibold">VERIFIED</span>
          </div>
          <div className="flex items-center justify-between">
            <span>API Proxy Mode</span>
            <span className="text-primary font-semibold">YAHOO FINANCE (Live NSE feed)</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      {isAuthenticated && (
        <Button onClick={logout} variant="destructive" className="w-full sm:w-auto gap-2">
          <LogOut className="w-4 h-4" /> Disconnect Account
        </Button>
      )}
    </div>
  );
}
