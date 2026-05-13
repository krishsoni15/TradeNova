"""
TradeNova Backend — Routes Package
"""

from app.routes.auth import router as auth_router
from app.routes.holdings import router as holdings_router
from app.routes.ws import router as ws_router

__all__ = ["auth_router", "holdings_router", "ws_router"]
