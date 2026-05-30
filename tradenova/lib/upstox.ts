/**
 * Upstox API utility functions (server-side only)
 * Used by Next.js API routes to interact with Upstox.
 * Falls back to mock data when Upstox credentials are not configured.
 */

const UPSTOX_BASE_URL = "https://api.upstox.com/v2";

/**
 * Exchange Upstox authorization code for access token.
 * This is called during the OAuth callback flow.
 */
export async function exchangeUpstoxCode(code: string) {
  const clientId = process.env.UPSTOX_API_KEY || "";
  const clientSecret = process.env.UPSTOX_API_SECRET || "";
  const redirectUri =
    process.env.UPSTOX_REDIRECT_URI || "http://localhost:3000/auth/callback";

  if (!clientId || !clientSecret) {
    throw new Error(
      "UPSTOX_API_KEY and UPSTOX_API_SECRET must be set in .env.local"
    );
  }

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch(`${UPSTOX_BASE_URL}/login/authorization/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "Api-Version": "2.0",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upstox token exchange error (${res.status}): ${errorText}`);
  }

  return res.json();
}

/**
 * Fetch user profile from Upstox API.
 */
export async function getUpstoxProfile(accessToken: string) {
  const res = await fetch(`${UPSTOX_BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Api-Version": "2.0",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upstox profile error (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  return json.data || {};
}

// ============================================
// Mock data for development without Upstox
// ============================================
const MOCK_HOLDINGS_DATA = [
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

/**
 * Compute portfolio summary from holdings list.
 */
function computeSummary(holdings: typeof MOCK_HOLDINGS_DATA) {
  const total_investment = holdings.reduce(
    (sum, h) => sum + h.invested_value,
    0
  );
  const current_value = holdings.reduce(
    (sum, h) => sum + h.current_value,
    0
  );
  const total_pnl = current_value - total_investment;
  const total_pnl_percentage = total_investment
    ? (total_pnl / total_investment) * 100
    : 0;

  const day_pnl = holdings.reduce(
    (sum, h) => sum + h.day_change * h.quantity,
    0
  );
  const prev_value = current_value - day_pnl;
  const day_pnl_percentage = prev_value ? (day_pnl / prev_value) * 100 : 0;

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
 * Fetch holdings from Upstox API.
 * Falls back to mock data if no access token or API is unreachable.
 */
export async function getHoldings(accessToken?: string) {
  if (accessToken && process.env.UPSTOX_API_KEY) {
    try {
      const res = await fetch(
        `${UPSTOX_BASE_URL}/portfolio/long-term-holdings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Api-Version": "2.0",
          },
        }
      );

      if (res.ok) {
        const json = await res.json();
        const data = json.data || [];

        const holdings = [];
        for (const item of data) {
          const total_quantity = item.quantity || 0;
          const cnc_used = item.cnc_used_quantity || 0;
          const net_quantity = total_quantity - cnc_used;

          if (net_quantity <= 0) continue;

          const avg_price = item.average_price || 0;
          const last_price = item.last_price || 0;
          let close_price = item.close_price || 0;

          const invested = avg_price * net_quantity;
          const current = last_price * net_quantity;
          const pnl = current - invested;

          if (close_price <= 0) close_price = last_price;

          const day_change = last_price - close_price;
          const day_change_percentage =
            close_price > 0 ? (day_change / close_price) * 100 : 0;

          holdings.push({
            tradingsymbol: item.tradingsymbol || "",
            exchange: item.exchange || "NSE",
            isin: item.isin || "",
            company_name:
              item.company_name || item.tradingsymbol || "",
            quantity: net_quantity,
            t1_quantity: item.t1_quantity || 0,
            average_price: avg_price,
            last_price: last_price,
            close_price: close_price,
            pnl: pnl,
            pnl_percentage: invested ? (pnl / invested) * 100 : 0,
            day_change: day_change,
            day_change_percentage: day_change_percentage,
            current_value: current,
            invested_value: invested,
          });
        }

        return {
          holdings,
          summary: computeSummary(holdings),
        };
      }
    } catch (err) {
      console.warn(
        "[Upstox] API error, falling back to mock holdings:",
        err
      );
    }
  }

  // Fallback to mock data with realistic live prices
  try {
    const yahooFinance = (await import("yahoo-finance2")).default;
    const symbols = MOCK_HOLDINGS_DATA.map((h) => h.tradingsymbol + ".NS");
    const quotes = await yahooFinance.quote(symbols);
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
    const qMap = new Map(
      quotesArray.map((q) => [q.symbol.replace(".NS", ""), q])
    );

    const dynamicMockHoldings = MOCK_HOLDINGS_DATA.map((h) => {
      const q = qMap.get(h.tradingsymbol);
      if (!q || !q.regularMarketPrice) return h;

      // Make average price 5% lower than current price for a realistic mock portfolio
      const avgPrice = q.regularMarketPrice * 0.95;
      const current = q.regularMarketPrice * h.quantity;
      const invested = avgPrice * h.quantity;
      const pnl = current - invested;

      return {
        ...h,
        average_price: avgPrice,
        last_price: q.regularMarketPrice,
        close_price: q.regularMarketPreviousClose || h.close_price,
        pnl: pnl,
        pnl_percentage: 5.26,
        day_change: q.regularMarketChange || h.day_change,
        day_change_percentage:
          q.regularMarketChangePercent || h.day_change_percentage,
        current_value: current,
        invested_value: invested,
      };
    });

    return {
      holdings: dynamicMockHoldings,
      summary: computeSummary(dynamicMockHoldings),
    };
  } catch (err) {
    console.warn("[Upstox] Failed to fetch dynamic mock prices:", err);
    return {
      holdings: MOCK_HOLDINGS_DATA,
      summary: computeSummary(MOCK_HOLDINGS_DATA),
    };
  }
}

/**
 * Fetch active positions from Upstox API.
 * Falls back to mock data if no access token or API is unreachable.
 */
export async function getPositions(accessToken?: string) {
  if (accessToken && process.env.UPSTOX_API_KEY) {
    try {
      const res = await fetch(
        `${UPSTOX_BASE_URL}/portfolio/short-term-positions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Api-Version": "2.0",
          },
        }
      );

      if (res.ok) {
        const json = await res.json();
        const data = json.data || [];

        const positions = data.map((item: any) => {
          const qty = Number(item.quantity ?? 0);
          const buyQty = Number(item.buy_quantity ?? 0);
          const sellQty = Number(item.sell_quantity ?? 0);
          const netQty = buyQty - sellQty;
          
          const avgPrice = Number(item.average_price ?? 0);
          const ltp = Number(item.last_price ?? 0);
          const pnl = Number(item.pnl ?? 0);
          const pnlPct = avgPrice > 0 ? (pnl / (avgPrice * Math.abs(netQty))) * 100 : 0;

          return {
            symbol: item.tradingsymbol || "",
            exchange: item.exchange || "NSE",
            type: item.instrument_type || "EQ",
            qty: netQty !== 0 ? netQty : qty,
            avgPrice,
            ltp,
            pnl,
            pnlPct,
          };
        });

        return positions;
      }
    } catch (err) {
      console.warn(
        "[Upstox] API error, falling back to mock positions:",
        err
      );
    }
  }

  // Fallback to mock F&O and equity positions
  return [
    { symbol: "NIFTY26JUN23000CE", type: "CALL", qty: 50, avgPrice: 120.5, ltp: 195.3, pnl: 3740, pnlPct: 62.07 },
    { symbol: "BANKNIFTY26JUN49000PE", type: "PUT", qty: 25, avgPrice: 280.0, ltp: 245.6, pnl: -860, pnlPct: -12.28 },
    { symbol: "RELIANCE", type: "EQ", qty: 10, avgPrice: 1250.0, ltp: 1321.20, pnl: 712.0, pnlPct: 5.69 },
  ];
}

