"""
TradeNova Backend — Auth Schemas
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class UpstoxCallbackRequest(BaseModel):
    """Request body for Upstox OAuth callback"""
    code: str
    state: Optional[str] = None


class UserResponse(BaseModel):
    """User profile response"""
    id: str
    email: str
    name: str
    broker_connected: bool
    created_at: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT token response after successful auth"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
