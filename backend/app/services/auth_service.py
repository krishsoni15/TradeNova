"""
TradeNova Backend — Auth Service
Handles JWT creation/verification and Upstox token exchange
"""

from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.config import get_settings

settings = get_settings()


def create_access_token(user_id: str) -> str:
    """Create a signed JWT token for the given user"""
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRY_HOURS)
    payload = {
        "sub": user_id,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def verify_access_token(token: str) -> dict | None:
    """
    Verify and decode a JWT token.
    Returns the payload dict if valid, None otherwise.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        # Check token type
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None
