/**
 * Holdings type definitions
 * Maps to Upstox Holdings API response structure
 */

/** Individual holding item */
export interface Holding {
  tradingsymbol: string;
  exchange: string;
  isin: string;
  quantity: number;
  t1_quantity: number;
  average_price: number;
  last_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
  close_price: number;
  /** Computed fields */
  current_value: number;
  invested_value: number;
  pnl_percentage: number;
  /** Company display name */
  company_name: string;
}

/** Portfolio summary computed from holdings */
export interface PortfolioSummary {
  total_investment: number;
  current_value: number;
  total_pnl: number;
  total_pnl_percentage: number;
  day_pnl: number;
  day_pnl_percentage: number;
  total_holdings: number;
}

/** Full holdings API response */
export interface HoldingsResponse {
  holdings: Holding[];
  summary: PortfolioSummary;
}
