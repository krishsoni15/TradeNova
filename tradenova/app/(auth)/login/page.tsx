"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";

/**
 * Login page
 * Upstox OAuth login with premium glassmorphism card design
 */
  import { useState } from "react";
  import { authService } from "@/services/auth.service";

  export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    /** Fetch auth URL from backend and redirect */
    const handleUpstoxLogin = async () => {
      try {
        setIsLoading(true);
        const url = await authService.getUpstoxAuthUrl();
        if (url) window.location.href = url;
      } catch (error) {
        console.error("Failed to get auth URL:", error);
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
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
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
          {/* Features list */}
          <div className="space-y-3">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent/30"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
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
              </motion.div>
            ))}
          </div>

          <Separator className="opacity-50" />

          {/* CTA Button */}
          <Button
            onClick={handleUpstoxLogin}
            disabled={isLoading}
            className="w-full h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold"
            size="lg"
          >
            {isLoading ? "Connecting..." : "Connect with Upstox"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </Button>

          {/* Disclaimer */}
          <p className="text-center text-[11px] text-muted-foreground/60">
            By connecting, you agree to share portfolio data with TradeNova.
            <br />
            We never place trades or modify your account.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
