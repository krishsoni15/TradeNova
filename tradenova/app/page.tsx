"use client";

import { motion } from "framer-motion";
import {
  ArrowRight, Shield, Zap, BarChart3, Activity, LineChart, Globe,
  Cpu, MessageSquare, BellRing, Lock, TrendingUp, Play, CheckCircle2,
  Terminal, Database, LayoutDashboard, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { CustomCursor } from "@/components/shared/custom-cursor";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";



/**
 * Animated Grid Background with precise fading
 */
const GridBackground = () => {
  const lines = Array.from({ length: 20 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#060608]">
      {/* Vertical Tracks */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] h-full flex justify-evenly">
        {lines.map((_, i) => {
          const duration1 = 4 + (i % 4) * 1.5;
          const delay1 = (i % 5) * 1.2;
          const duration2 = 5 + (i % 3) * 2;
          const delay2 = (i % 6) * 1.5;
          
          return (
            <div key={i} className="relative w-[1px] h-full bg-white/[0.04]">
              {/* Green Laser Packets */}
              {i % 2 === 0 && (
                <motion.div
                  className="absolute left-[-1px] w-[3px] h-[20vh] bg-gradient-to-t from-transparent via-[#10b981] to-transparent blur-[1px] shadow-[0_0_10px_#10b981]"
                  initial={{ top: "110%", opacity: 0 }}
                  animate={{ top: "-20%", opacity: [0, 1, 1, 0] }}
                  transition={{ duration: duration1, repeat: Infinity, ease: "linear", delay: delay1 }}
                />
              )}
              {/* White Data Packets */}
              {i % 3 === 0 && (
                <motion.div
                  className="absolute left-0 w-[1px] h-[15vh] bg-gradient-to-t from-transparent via-white/80 to-transparent shadow-[0_0_15px_#ffffff]"
                  initial={{ top: "110%", opacity: 0 }}
                  animate={{ top: "-20%", opacity: [0, 1, 1, 0] }}
                  transition={{ duration: duration2, repeat: Infinity, ease: "linear", delay: delay2 }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Central Horizon Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#10b981]/5 rounded-[100%] blur-[120px] pointer-events-none mix-blend-screen" />
      
      {/* Deep Edge Masks */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,transparent_30%,#060608_100%)] z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#060608] z-10" />
    </div>
  );
};

/**
 * Floating 3D-like Trading Elements for Hero
 */
const HeroVisuals = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto h-[400px] mt-8 perspective-1000 hidden md:block">
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10" />

      {/* Main Dashboard Mock with Intense Glow / Laser Beam effect */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 10 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="w-full h-full bg-[#09090b] border border-primary/20 rounded-t-2xl shadow-[0_0_80px_rgba(16,185,129,0.1),0_0_30px_rgba(16,185,129,0.15),inset_0_2px_20px_rgba(16,185,129,0.1)] overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
          {/* Mock Topbar */}
          <div className="h-12 border-b border-primary/10 flex items-center px-4 gap-2 bg-primary/5">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            </div>
            <div className="mx-auto w-96 h-8 bg-white/5 rounded-full flex items-center px-3 border border-white/5 shadow-inner">
               <Search className="w-3.5 h-3.5 text-muted-foreground mr-2 shrink-0" />
               <span className="text-[11px] text-muted-foreground/80 flex-1 truncate">Search instruments, algos, or symbols...</span>
               <div className="shrink-0 flex items-center gap-1">
                 <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground font-mono">⌘</span>
                 <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground font-mono">K</span>
               </div>
            </div>
            <div className="w-10 shrink-0" />
          </div>
        {/* Mock Content */}
        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Animated Laser Chart Area */}
            <div className="h-48 bg-gradient-to-tr from-primary/5 to-transparent border border-primary/20 rounded-xl p-4 flex items-end relative overflow-hidden shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
              <div className="absolute inset-0 bg-primary/5 animate-pulse-soft mix-blend-screen" />
              <svg viewBox="0 0 100 40" className="w-full h-32 relative z-10 preserve-3d">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Area Fill */}
                <motion.path
                  d="M 0 40 L 0 35 L 10 25 L 20 28 L 30 15 L 40 20 L 50 5 L 60 12 L 70 8 L 80 18 L 90 2 L 100 10 L 100 40 Z"
                  fill="url(#chartGradient)"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                {/* Laser Line */}
                <motion.path
                  d="M 0 35 L 10 25 L 20 28 L 30 15 L 40 20 L 50 5 L 60 12 L 70 8 L 80 18 L 90 2 L 100 10"
                  className="stroke-primary stroke-[1.5] fill-none"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 1.5 }}
                />
                {/* Moving Dot */}
                <motion.circle
                  r="1.5"
                  className="fill-white"
                  filter="url(#glow)"
                  initial={{ cx: 0, cy: 35 }}
                  animate={{
                    cx: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    cy: [35, 25, 28, 15, 20, 5, 12, 8, 18, 2, 10]
                  }}
                  transition={{ duration: 2.5, ease: "linear", repeat: Infinity, repeatDelay: 1.5 }}
                />
              </svg>
            </div>

            {/* Animated Equalizer/Bar Charts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-white/5 border border-white/5 rounded-xl flex items-end p-3 gap-2 overflow-hidden">
                {[40, 70, 45, 90, 65, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-full bg-primary/40 rounded-t-sm"
                    initial={{ height: "10%" }}
                    animate={{ height: [`${h}%`, `${h - 20}%`, `${h}%`] }}
                    transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <div className="h-24 bg-white/5 border border-white/5 rounded-xl flex items-end p-3 gap-2 overflow-hidden">
                {[60, 30, 85, 50, 75, 40].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-full bg-blue-500/40 rounded-t-sm"
                    initial={{ height: "10%" }}
                    animate={{ height: [`${h}%`, `${h + 20}%`, `${h}%`] }}
                    transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Animated Feed / Order Book */}
          <div className="space-y-4">
            {[
              { symbol: "RELIANCE", price: "2,845.20", change: "+1.2%", up: true, volume: 85 },
              { symbol: "HDFCBANK", price: "1,642.10", change: "-0.4%", up: false, volume: 60 },
              { symbol: "TCS", price: "4,120.55", change: "+0.8%", up: true, volume: 40 },
              { symbol: "INFY", price: "1,450.00", change: "-1.1%", up: false, volume: 90 },
            ].map((stock, i) => (
              <motion.div
                key={i}
                className="h-[68px] bg-white/5 border border-white/5 rounded-xl flex items-center p-3 gap-3 relative overflow-hidden"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                {/* Background volume bar */}
                <motion.div 
                  className={`absolute top-0 right-0 h-full ${stock.up ? 'bg-green-500/5' : 'bg-red-500/5'} z-0`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${stock.volume}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                />
                
                <div className={`relative z-10 w-8 h-8 shrink-0 rounded-full ${stock.up ? 'bg-green-500/20 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'} flex items-center justify-center text-xs font-bold`}>
                  {stock.up ? '↑' : '↓'}
                </div>
                <div className="relative z-10 flex-1 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-white/90">{stock.symbol}</div>
                    <div className={`text-[10px] ${stock.up ? 'text-green-400' : 'text-red-400'}`}>{stock.change}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-white/90 tabular-nums">₹{stock.price}</div>
                    <div className="text-[9px] text-muted-foreground/60">Vol: {stock.volume}k</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </motion.div>
      </motion.div>

      {/* Floating Algo Card */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -left-12 w-64 p-4 bg-[#0a0a0c]/80 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] z-20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Cpu className="h-5 w-5 text-primary drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
          <span className="text-sm font-semibold text-white">Algo: MACD Cross</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Status</span>
          <span className="text-primary flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" /> Running
          </span>
        </div>
      </motion.div>

      {/* Floating AI Chat Card */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 -right-12 w-72 p-4 bg-[#0a0a0c]/80 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] z-20"
      >
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-white/90 font-medium">"Why is my portfolio down?"</p>
            <p className="text-[10px] text-muted-foreground/90 leading-relaxed">AI: NIFTY IT is dragging down your tech holdings by 1.2% due to global cues.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Automatically redirect to dashboard if already authenticated
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, router]);

  const handleConnect = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const features = [
    { icon: Activity, title: "Live price feed", desc: "Real-time Nifty, Sensex, your stocks every second" },
    { icon: BarChart3, title: "Portfolio tracker", desc: "Holdings and P&L pulled live from your broker" },
    { icon: TrendingUp, title: "Buy / sell orders", desc: "Place market or limit orders directly from your browser" },
    { icon: Cpu, title: "Algo bots", desc: "RSI, MACD, moving average, HMM. Start and stop in one click" },
    { icon: MessageSquare, title: "AI portfolio chat", desc: "Ask 'why am I down today?' and get a real answer" },
    { icon: BellRing, title: "Telegram alerts", desc: "Instant messages when price crosses your level. Free" },
    { icon: Shield, title: "Circuit breaker", desc: "Bot auto-stops at 2% daily loss. Locks at 3%" },
    { icon: LineChart, title: "Options chain", desc: "Greeks, IV, payoff diagram all in one elegant view" },
  ];

  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const circle = document.createElement("div");
    const d = Math.max(100, 100);
    circle.style.width = circle.style.height = `${d}px`;
    circle.style.left = `${e.pageX - d / 2}px`;
    circle.style.top = `${e.pageY - d / 2}px`;
    circle.classList.add("ripple-element");

    const container = e.currentTarget;
    container.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  }, []);

  return (
    <div onClick={handlePageClick} className="min-h-screen bg-[#060608] selection:bg-primary/30 relative flex flex-col font-sans overflow-hidden cursor-none">
      <CustomCursor />
      <GridBackground />

      {/* Navbar overlay */}
      <header className="absolute top-0 w-full z-50 flex items-center justify-between p-6 lg:px-12">
        <Logo />
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground hover:bg-white/5"
          onClick={() => router.push("/login")}
        >
          {isAuthenticated ? "Dashboard" : "Login"}
        </Button>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative z-10 pt-20 lg:pt-28 pb-0 px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground text-sm font-medium mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            v1.0 Now Open Source
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Your trades. Automated.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-400">
              AI-powered. Yours.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            One dashboard to connect your broker, track your portfolio, run algo bots, and chat with AI that actually understands your holdings.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleConnect}
              size="lg"
              className="group h-12 px-8 text-base font-semibold bg-primary hover:bg-emerald-400 text-primary-foreground shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative z-10 flex items-center">
                Connect your broker
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-medium border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 group"
            >
              <Play className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform" /> See how it works
            </Button>
          </div>
        </motion.div>

        <HeroVisuals />
      </section>

      {/* 2. STATS BAR */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-4 md:pt-0">
              <div className="text-4xl font-bold text-foreground mb-1">9</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Dashboard Pages</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl font-bold text-foreground mb-1">6</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Algo Strategies Built-in</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl font-bold text-foreground mb-1">100%</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Free to self-host</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 1 - WHAT IT DOES */}
      <section className="relative z-10 py-24 px-4 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything in one place</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Live prices, portfolio, orders, algo bots, options chain, news, P&L reports — all from one browser tab. No switching between 5 apps.
          </p>
        </motion.div>

        {/* Glowy Bento Box */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/10 to-transparent group hover:from-primary/30 transition-colors duration-700">
          <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 group-hover:bg-primary/20 transition-all duration-700" />
          <div className="bg-[#0c0c0e] rounded-[22px] p-8 lg:p-12 border border-white/5 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            <div className="flex-1 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 text-sm font-medium border border-transparent group-hover:border-primary/20 transition-colors">
                <Database className="w-4 h-4 text-primary" /> Unified Architecture
              </div>
              <h3 className="text-2xl font-semibold leading-snug text-white/90 group-hover:text-white transition-colors">
                Stop fragmented trading. Bring your data home.
              </h3>
              <ul className="space-y-3">
                {["Single pane of glass for all assets", "Zero-latency local WebSocket streaming", "Automated daily P&L syncing"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground group-hover:text-white/80 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full relative z-10 group-hover:-translate-y-2 transition-transform duration-700">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-2xl p-4 flex flex-col gap-3 group-hover:shadow-[0_0_50px_rgba(var(--primary),0.1)] group-hover:border-primary/30 transition-all duration-500">
                <div className="w-full h-8 bg-white/5 rounded-md group-hover:bg-white/10 transition-colors" />
                <div className="flex-1 flex gap-3">
                  <div className="w-1/3 h-full bg-white/5 rounded-md group-hover:bg-white/10 transition-colors" />
                  <div className="w-2/3 h-full bg-white/5 rounded-md group-hover:bg-white/10 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2 - FEATURES */}
      <section className="relative z-10 py-24 px-4 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful primitives.</h2>
            <p className="text-lg text-muted-foreground">Built for traders who need more than just charts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:-translate-y-2 hover:border-primary/50 hover:bg-white/[0.06] transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <feature.icon className="h-8 w-8 text-primary mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10" />
                <h3 className="text-lg font-semibold mb-2 text-foreground/90 group-hover:text-white transition-colors relative z-10">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-white/80 transition-colors relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION 3 - THE PROBLEM WE SOLVE */}
      <section className="relative z-10 py-24 px-4 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold">Most trading tools are locked to one broker.</h2>
            <p className="text-lg text-muted-foreground">
              They show you static charts, charge premium subscriptions, and give you zero help thinking about your money.
              <br /><br />
              This platform is different.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { title: "Connect any broker", desc: "Upstox, Zerodha, Angel One, more coming" },
              { title: "AI that reasons over your real data", desc: "Not generic market advice. Context-aware AI." },
              { title: "No-code algo builder", desc: "Set rules without writing a single line of Python" },
              { title: "Auto position sizing", desc: "Tells you exactly how many shares to buy based on risk" },
              { title: "Morning briefing", desc: "AI summary sent directly to Telegram at 8:30 AM, free" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-primary" /></div>
                <div>
                  <h4 className="font-semibold text-foreground/90">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. SECTION 4 - HOW IT WORKS */}
      <section className="relative z-10 py-24 px-4 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Connect broker", desc: "Paste your API key, done in 2 minutes." },
              { step: "02", title: "See live data", desc: "Holdings, positions, P&L all appear instantly." },
              { step: "03", title: "Set rules", desc: "Price alert or full algo strategy, your choice." },
              { step: "04", title: "Trade smarter", desc: "Ask AI questions, get briefings, execute." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-5xl font-black text-white/[0.03] mb-4">{item.step}</div>
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mt-8 mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION 5 - BROKERS & SECTION 6 - FREE */}
      <section className="relative z-10 py-24 px-4 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-8">
        {/* Brokers */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col justify-center items-center text-center">
          <Globe className="w-10 h-10 text-muted-foreground mb-6" />
          <h3 className="text-2xl font-bold mb-4">Brokers supported</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["Upstox", "Zerodha", "Angel One", "More coming soon..."].map((b, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Free */}
        <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl" />
          <Lock className="w-10 h-10 text-primary mb-6" />
          <h3 className="text-2xl font-bold mb-4 text-foreground">100% free to run</h3>
          <p className="text-muted-foreground mb-6">
            No subscription. No per-trade fee. No ads. You host it yourself — your data never leaves your machine.
          </p>
          <div className="text-xs text-muted-foreground/60 space-y-1">
            <p>Free tools used:</p>
            <p>Telegram (alerts) · MoneyControl RSS (news)</p>
            <p>TradingView Charts · Supabase (DB) · Railway (hosting)</p>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="relative z-10 py-32 px-4 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-primary/5">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to own your trading?</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Everything is open source. Connect your broker and go live in an afternoon.
        </p>
        <Button
          onClick={handleConnect}
          size="lg"
          className="h-14 px-10 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 transition-transform hover:scale-105"
        >
          Get started
        </Button>
      </section>

      {/* 9. FOOTER */}
      <footer className="relative z-10 py-8 text-center border-t border-white/5 bg-[#060608]">
        <p className="text-sm text-muted-foreground/60 font-mono tracking-tight">
          Built with FastAPI · React · Upstox API · Claude AI · PostgreSQL
        </p>
      </footer>
    </div>
  );
}
