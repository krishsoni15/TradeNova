"""
TradeNova Backend — Holdings Schemas
"""

from pydantic import BaseModel
from typing import List


class HoldingItem(BaseModel):
    """Individual holding"""
    tradingsymbol: str
    exchange: str
    isin: str
    company_name: str
    quantity: int
    t1_quantity: int
    average_price: float
    last_price: float
    close_price: float
    pnl: float
    pnl_percentage: float
    day_change: float
    day_change_percentage: float
    current_value: float
    invested_value: float


class PortfolioSummary(BaseModel):
    """Aggregated portfolio metrics"""
    total_investment: float
    current_value: float
    total_pnl: float
    total_pnl_percentage: float
    day_pnl: float
    day_pnl_percentage: float
    total_holdings: int


class HoldingsResponse(BaseModel):
    """Full holdings response with summary"""
    holdings: List[HoldingItem]
    summary: PortfolioSummary
