import {
  LayoutDashboard,
  Briefcase,
  Target,
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
    href: "/dashboard",
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
    title: "Positions",
    href: "/positions",
    icon: Target,
    active: true,
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


