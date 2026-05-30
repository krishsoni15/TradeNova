"use client";

import { ArrowRight, Shield, Zap, BarChart3, AlertCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { authService } from "@/services/auth.service";

/**
 * Login page
 * Upstox OAuth login with premium glassmorphism card design.
 * Error states are shown inline with recovery suggestions.
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch auth URL from Next.js API route and redirect to Upstox */
  const handleUpstoxLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const url = await authService.getUpstoxAuthUrl();
      if (url) {
        window.location.href = url;
      } else {
        setError("Received empty auth URL. Check your Upstox API configuration.");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Failed to get auth URL:", err);
      setError(err.message || "Failed to connect to Upstox. Please try again.");
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Portfolio",
      description: "Live holdings & P&L tracking",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second market data updates",
    },
    {
      icon: Shield,
      title: "Bank-grade Security",
      description: "Encrypted token storage",
    },
  ];

  return (
    <div className="animate-fade-in">
      <Card className="glass-strong border-border/50 shadow-2xl">
        <CardHeader className="space-y-4 pb-4 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Welcome to TradeNova
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect your Upstox account to get started
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error display */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div className="space-y-1">
                <p className="text-sm text-red-300">{error}</p>
                <p className="text-xs text-red-400/70">
                  Make sure Upstox API keys are set in your .env.local file.
                </p>
              </div>
            </div>
          )}

          {/* Features list */}
          <div className="space-y-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 rounded-lg p-2.5 transition-all hover:bg-accent/30 hover:pl-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {feature.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="opacity-50" />

          {/* CTA Button */}
          <Button
            onClick={handleUpstoxLogin}
            disabled={isLoading}
            className="w-full h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold transition-all"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Connecting...
              </>
            ) : (
              <>
                Connect with Upstox
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Demo mode notice */}
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-center">
            <p className="text-xs text-muted-foreground/80">
              <ExternalLink className="mr-1 inline h-3 w-3" />
              No Upstox account? The dashboard loads with demo data automatically.
            </p>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-[11px] text-muted-foreground/60">
            By connecting, you agree to share portfolio data with TradeNova.
            <br />
            We never place trades or modify your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
