"""
TradeNova Backend — Upstox Service
Wrapper for Upstox API calls (Holdings, Positions, Auth)
"""

import httpx
import logging
from typing import Any
from app.config import get_settings
from app.schemas.holdings import HoldingItem, PortfolioSummary, HoldingsResponse

logger = logging.getLogger(__name__)
settings = get_settings()

# Upstox API base URL
UPSTOX_BASE_URL = "https://api.upstox.com/v2"

# ============================================
# Mock data for development without Upstox credentials
# ============================================
MOCK_HOLDINGS_DATA = [
    {
        "tradingsymbol": "RELIANCE",
        "exchange": "NSE",
        "isin": "INE002A01018",
        "company_name": "Reliance Industries Ltd",
        "quantity": 25,
        "t1_quantity": 0,
        "average_price": 2450.00,
        "last_price": 2678.35,
        "close_price": 2655.00,
        "pnl": 5708.75,
        "pnl_percentage": 9.32,
        "day_change": 23.35,
        "day_change_percentage": 0.88,
        "current_value": 66958.75,
        "invested_value": 61250.00,
    },
    {
        "tradingsymbol": "TCS",
        "exchange": "NSE",
        "isin": "INE467B01029",
        "company_name": "Tata Consultancy Services",
        "quantity": 15,
        "t1_quantity": 0,
        "average_price": 3520.00,
        "last_price": 3789.50,
        "close_price": 3810.00,
        "pnl": 4042.50,
        "pnl_percentage": 7.65,
        "day_change": -20.50,
        "day_change_percentage": -0.54,
        "current_value": 56842.50,
        "invested_value": 52800.00,
    },
    {
        "tradingsymbol": "HDFCBANK",
        "exchange": "NSE",
        "isin": "INE040A01034",
        "company_name": "HDFC Bank Ltd",
        "quantity": 40,
        "t1_quantity": 0,
        "average_price": 1580.00,
        "last_price": 1695.20,
        "close_price": 1688.00,
        "pnl": 4608.00,
        "pnl_percentage": 7.29,
        "day_change": 7.20,
        "day_change_percentage": 0.43,
        "current_value": 67808.00,
        "invested_value": 63200.00,
    },
    {
        "tradingsymbol": "INFY",
        "exchange": "NSE",
        "isin": "INE009A01021",
        "company_name": "Infosys Ltd",
        "quantity": 30,
        "t1_quantity": 0,
        "average_price": 1480.00,
        "last_price": 1425.60,
        "close_price": 1430.00,
        "pnl": -1632.00,
        "pnl_percentage": -3.68,
        "day_change": -4.40,
        "day_change_percentage": -0.31,
        "current_value": 42768.00,
        "invested_value": 44400.00,
    },
    {
        "tradingsymbol": "TATAMOTORS",
        "exchange": "NSE",
        "isin": "INE155A01022",
        "company_name": "Tata Motors Ltd",
        "quantity": 50,
        "t1_quantity": 0,
        "average_price": 680.00,
        "last_price": 758.45,
        "close_price": 750.00,
        "pnl": 3922.50,
        "pnl_percentage": 11.54,
        "day_change": 8.45,
        "day_change_percentage": 1.13,
        "current_value": 37922.50,
        "invested_value": 34000.00,
    },
    {
        "tradingsymbol": "WIPRO",
        "exchange": "NSE",
        "isin": "INE075A01022",
        "company_name": "Wipro Ltd",
        "quantity": 60,
        "t1_quantity": 0,
        "average_price": 420.00,
        "last_price": 455.30,
        "close_price": 452.00,
        "pnl": 2118.00,
        "pnl_percentage": 8.40,
        "day_change": 3.30,
        "day_change_percentage": 0.73,
        "current_value": 27318.00,
        "invested_value": 25200.00,
    },
    {
        "tradingsymbol": "ICICIBANK",
        "exchange": "NSE",
        "isin": "INE090A01021",
        "company_name": "ICICI Bank Ltd",
        "quantity": 35,
        "t1_quantity": 0,
        "average_price": 1020.00,
        "last_price": 1098.75,
        "close_price": 1085.00,
        "pnl": 2756.25,
        "pnl_percentage": 7.72,
        "day_change": 13.75,
        "day_change_percentage": 1.27,
        "current_value": 38456.25,
        "invested_value": 35700.00,
    },
    {
        "tradingsymbol": "BAJFINANCE",
        "exchange": "NSE",
        "isin": "INE296A01024",
        "company_name": "Bajaj Finance Ltd",
        "quantity": 10,
        "t1_quantity": 0,
        "average_price": 7200.00,
        "last_price": 6890.50,
        "close_price": 6920.00,
        "pnl": -3095.00,
        "pnl_percentage": -4.30,
        "day_change": -29.50,
        "day_change_percentage": -0.43,
        "current_value": 68905.00,
        "invested_value": 72000.00,
    },
]


def _compute_summary(holdings: list[dict]) -> PortfolioSummary:
    """Compute portfolio summary from holdings list"""
    total_investment = sum(h["invested_value"] for h in holdings)
    current_value = sum(h["current_value"] for h in holdings)
    total_pnl = current_value - total_investment
    total_pnl_percentage = (total_pnl / total_investment * 100) if total_investment else 0

    day_pnl = sum(h["day_change"] * h["quantity"] for h in holdings)
    prev_value = current_value - day_pnl
    day_pnl_percentage = (day_pnl / prev_value * 100) if prev_value else 0

    return PortfolioSummary(
        total_investment=total_investment,
        current_value=current_value,
        total_pnl=total_pnl,
        total_pnl_percentage=total_pnl_percentage,
        day_pnl=day_pnl,
        day_pnl_percentage=day_pnl_percentage,
        total_holdings=len(holdings),
    )


async def exchange_upstox_code(code: str) -> dict[str, Any]:
    """
    Exchange authorization code for Upstox access token.
    Returns the token response from Upstox.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{UPSTOX_BASE_URL}/login/authorization/token",
            data={
                "code": code,
                "client_id": settings.UPSTOX_API_KEY,
                "client_secret": settings.UPSTOX_API_SECRET,
                "redirect_uri": settings.UPSTOX_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
        return response.json()


async def get_upstox_profile(access_token: str) -> dict[str, Any]:
    """Fetch user profile from Upstox"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{UPSTOX_BASE_URL}/user/profile",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        return response.json().get("data", {})


async def get_holdings(access_token: str | None = None) -> HoldingsResponse:
    """
    Fetch holdings from Upstox API.
    Falls back to mock data if no access token or API is unreachable.
    """
    if access_token and settings.UPSTOX_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{UPSTOX_BASE_URL}/portfolio/long-term-holdings",
                    headers={"Authorization": f"Bearer {access_token}"},
                )
                response.raise_for_status()
                data = response.json().get("data", [])

                # Transform Upstox response to our schema
                holdings = []
                for item in data:
                    invested = item.get("average_price", 0) * item.get("quantity", 0)
                    current = item.get("last_price", 0) * item.get("quantity", 0)
                    pnl = current - invested

                    holdings.append({
                        "tradingsymbol": item.get("tradingsymbol", ""),
                        "exchange": item.get("exchange", "NSE"),
                        "isin": item.get("isin", ""),
                        "company_name": item.get("company_name", item.get("tradingsymbol", "")),
                        "quantity": item.get("quantity", 0),
                        "t1_quantity": item.get("t1_quantity", 0),
                        "average_price": item.get("average_price", 0),
                        "last_price": item.get("last_price", 0),
                        "close_price": item.get("close_price", 0),
                        "pnl": pnl,
                        "pnl_percentage": (pnl / invested * 100) if invested else 0,
                        "day_change": item.get("day_change", 0),
                        "day_change_percentage": item.get("day_change_percentage", 0),
                        "current_value": current,
                        "invested_value": invested,
                    })

                return HoldingsResponse(
                    holdings=[HoldingItem(**h) for h in holdings],
                    summary=_compute_summary(holdings),
                )

        except Exception as e:
            logger.warning(f"Upstox API error, falling back to mock data: {e}")

    # Fallback to mock data
    logger.info("Using mock holdings data")
    return HoldingsResponse(
        holdings=[HoldingItem(**h) for h in MOCK_HOLDINGS_DATA],
        summary=_compute_summary(MOCK_HOLDINGS_DATA),
    )
