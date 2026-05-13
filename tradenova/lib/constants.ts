import {
  LayoutDashboard,
  Briefcase,
  ArrowLeftRight,
  Target,
  Eye,
  Settings,
  type LucideIcon,
} from "lucide-react";

/**
 * Navigation items for the sidebar
 * `active` indicates whether the page is built in this phase
 */
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Holdings",
    href: "/holdings",
    icon: Briefcase,
    active: true,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ArrowLeftRight,
    active: false,
    badge: "Soon",
  },
  {
    title: "Positions",
    href: "/positions",
    icon: Target,
    active: false,
    badge: "Soon",
  },
  {
    title: "Watchlist",
    href: "/watchlist",
    icon: Eye,
    active: false,
    badge: "Soon",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    active: false,
  },
];

/** Currency formatter — Indian Rupees */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/** Percentage formatter */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

/** Number formatter with commas */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-IN").format(value);
};

/** Determine P&L color class */
export const getPnlColor = (value: number): string => {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-muted-foreground";
};

/** Determine P&L background class */
export const getPnlBg = (value: number): string => {
  if (value > 0) return "bg-profit-bg";
  if (value < 0) return "bg-loss-bg";
  return "bg-muted/50";
};
