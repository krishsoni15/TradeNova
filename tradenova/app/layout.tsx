import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

/**
 * Root layout — wraps entire app with providers
 * Forces dark mode for trading terminal aesthetic
 */

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TradeNova — Premium Trading Dashboard",
  description:
    "Professional-grade trading dashboard with Upstox integration. Monitor your portfolio, track holdings, and manage trades in real-time.",
  keywords: ["trading", "dashboard", "upstox", "portfolio", "stocks", "NSE", "BSE"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Force dark mode always — trading terminal aesthetic
      className={`${inter.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
