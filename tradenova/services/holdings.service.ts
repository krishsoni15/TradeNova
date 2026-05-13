import apiClient from "./api-client";
import type { HoldingsResponse, Holding, PortfolioSummary } from "@/types/holdings";
import type { ApiResponse } from "@/types/api";

/**
 * Mock holdings data for development
 * Used when backend is not running or Upstox is not connected
 */
const MOCK_HOLDINGS: Holding[] = [
  {
    tradingsymbol: "RELIANCE",
    exchange: "NSE",
    isin: "INE002A01018",
    company_name: "Reliance Industries Ltd",
    quantity: 25,
    t1_quantity: 0,
    average_price: 2450.0,
    last_price: 2678.35,
    close_price: 2655.0,
    pnl: 5708.75,
    pnl_percentage: 9.32,
    day_change: 23.35,
    day_change_percentage: 0.88,
    current_value: 66958.75,
    invested_value: 61250.0,
  },
  {
    tradingsymbol: "TCS",
    exchange: "NSE",
    isin: "INE467B01029",
    company_name: "Tata Consultancy Services",
    quantity: 15,
    t1_quantity: 0,
    average_price: 3520.0,
    last_price: 3789.5,
    close_price: 3810.0,
    pnl: 4042.5,
    pnl_percentage: 7.65,
    day_change: -20.5,
    day_change_percentage: -0.54,
    current_value: 56842.5,
    invested_value: 52800.0,
  },
  {
    tradingsymbol: "HDFCBANK",
    exchange: "NSE",
    isin: "INE040A01034",
    company_name: "HDFC Bank Ltd",
    quantity: 40,
    t1_quantity: 0,
    average_price: 1580.0,
    last_price: 1695.2,
    close_price: 1688.0,
    pnl: 4608.0,
    pnl_percentage: 7.29,
    day_change: 7.2,
    day_change_percentage: 0.43,
    current_value: 67808.0,
    invested_value: 63200.0,
  },
  {
    tradingsymbol: "INFY",
    exchange: "NSE",
    isin: "INE009A01021",
    company_name: "Infosys Ltd",
    quantity: 30,
    t1_quantity: 0,
    average_price: 1480.0,
    last_price: 1425.6,
    close_price: 1430.0,
    pnl: -1632.0,
    pnl_percentage: -3.68,
    day_change: -4.4,
    day_change_percentage: -0.31,
    current_value: 42768.0,
    invested_value: 44400.0,
  },
  {
    tradingsymbol: "TATAMOTORS",
    exchange: "NSE",
    isin: "INE155A01022",
    company_name: "Tata Motors Ltd",
    quantity: 50,
    t1_quantity: 0,
    average_price: 680.0,
    last_price: 758.45,
    close_price: 750.0,
    pnl: 3922.5,
    pnl_percentage: 11.54,
    day_change: 8.45,
    day_change_percentage: 1.13,
    current_value: 37922.5,
    invested_value: 34000.0,
  },
  {
    tradingsymbol: "WIPRO",
    exchange: "NSE",
    isin: "INE075A01022",
    company_name: "Wipro Ltd",
    quantity: 60,
    t1_quantity: 0,
    average_price: 420.0,
    last_price: 455.3,
    close_price: 452.0,
    pnl: 2118.0,
    pnl_percentage: 8.4,
    day_change: 3.3,
    day_change_percentage: 0.73,
    current_value: 27318.0,
    invested_value: 25200.0,
  },
  {
    tradingsymbol: "ICICIBANK",
    exchange: "NSE",
    isin: "INE090A01021",
    company_name: "ICICI Bank Ltd",
    quantity: 35,
    t1_quantity: 0,
    average_price: 1020.0,
    last_price: 1098.75,
    close_price: 1085.0,
    pnl: 2756.25,
    pnl_percentage: 7.72,
    day_change: 13.75,
    day_change_percentage: 1.27,
    current_value: 38456.25,
    invested_value: 35700.0,
  },
  {
    tradingsymbol: "BAJFINANCE",
    exchange: "NSE",
    isin: "INE296A01024",
    company_name: "Bajaj Finance Ltd",
    quantity: 10,
    t1_quantity: 0,
    average_price: 7200.0,
    last_price: 6890.5,
    close_price: 6920.0,
    pnl: -3095.0,
    pnl_percentage: -4.3,
    day_change: -29.5,
    day_change_percentage: -0.43,
    current_value: 68905.0,
    invested_value: 72000.0,
  },
];

/** Compute portfolio summary from holdings list */
function computeSummary(holdings: Holding[]): PortfolioSummary {
  const total_investment = holdings.reduce((sum, h) => sum + h.invested_value, 0);
  const current_value = holdings.reduce((sum, h) => sum + h.current_value, 0);
  const total_pnl = current_value - total_investment;
  const total_pnl_percentage =
    total_investment > 0 ? (total_pnl / total_investment) * 100 : 0;

  const day_pnl = holdings.reduce(
    (sum, h) => sum + h.day_change * h.quantity,
    0
  );
  const day_pnl_percentage =
    current_value > 0 ? (day_pnl / (current_value - day_pnl)) * 100 : 0;

  return {
    total_investment,
    current_value,
    total_pnl,
    total_pnl_percentage,
    day_pnl,
    day_pnl_percentage,
    total_holdings: holdings.length,
  };
}

/**
 * Holdings service
 * Fetches portfolio holdings from backend, falls back to mock data
 */
export const holdingsService = {
  /**
   * Get all holdings with portfolio summary
   */
  async getHoldings(): Promise<HoldingsResponse> {
    try {
      const { data } = await apiClient.get<ApiResponse<HoldingsResponse>>(
        "/holdings"
      );
      return data.data;
    } catch {
      // Fallback to mock data in development
      console.warn("[TradeNova] Using mock holdings data — backend not available");
      return {
        holdings: MOCK_HOLDINGS,
        summary: computeSummary(MOCK_HOLDINGS),
      };
    }
  },
};
