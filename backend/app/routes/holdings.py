"""
TradeNova Backend — Holdings Routes
Fetches portfolio holdings from Upstox
"""

from fastapi import APIRouter, Depends

from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.holdings import HoldingsResponse
from app.services import upstox_service
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/holdings", tags=["Holdings"])


@router.get("", response_model=APIResponse[HoldingsResponse])
async def get_holdings(current_user: User = Depends(get_current_user)):
    """
    Get authenticated user's portfolio holdings.
    Fetches from Upstox if connected, otherwise returns mock data.
    """
    holdings = await upstox_service.get_holdings(
        access_token=current_user.upstox_access_token
    )

    return APIResponse(
        data=holdings,
        message=f"Found {holdings.summary.total_holdings} holdings",
    )


@router.get("/mock", response_model=APIResponse[HoldingsResponse])
async def get_mock_holdings():
    """
    Get mock holdings data — no authentication required.
    Useful for frontend development and testing.
    """
    holdings = await upstox_service.get_holdings(access_token=None)
    return APIResponse(
        data=holdings,
        message="Mock holdings data",
    )
