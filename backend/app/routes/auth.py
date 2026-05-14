"""
TradeNova Backend — Auth Routes
Handles Upstox OAuth callback and user profile
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.auth import UpstoxCallbackRequest, TokenResponse, UserResponse
from app.services.auth_service import create_access_token
from app.services import upstox_service
from app.middleware.auth_middleware import get_current_user

from app.config import get_settings

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()

@router.get("/upstox/login")
async def get_upstox_login_url():
    """
    Returns the Upstox OAuth authorization URL.
    The frontend should redirect the user to this URL.
    """
    client_id = settings.UPSTOX_API_KEY
    redirect_uri = settings.UPSTOX_REDIRECT_URI
    
    if not client_id:
        raise HTTPException(status_code=500, detail="Upstox API keys not configured")
        
    auth_url = (
        f"https://api.upstox.com/v2/login/authorization/dialog"
        f"?response_type=code"
        f"&client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
    )
    
    return {"url": auth_url}


@router.post("/upstox/callback", response_model=APIResponse[TokenResponse])
async def upstox_callback(
    payload: UpstoxCallbackRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Exchange Upstox authorization code for access token.
    Creates or updates user, returns JWT.
    """
    try:
        # Exchange code for Upstox token
        token_data = await upstox_service.exchange_upstox_code(payload.code)
        access_token = token_data.get("access_token")

        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to obtain Upstox access token",
            )

        # Get user profile from Upstox
        profile = await upstox_service.get_upstox_profile(access_token)
        email = profile.get("email", "")
        name = profile.get("user_name", "")
        upstox_user_id = profile.get("user_id", "")

        # Upsert user
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user:
            # Update existing user
            user.upstox_access_token = access_token
            user.upstox_user_id = upstox_user_id
            user.name = name
            user.broker_connected = True
        else:
            # Create new user
            user = User(
                email=email,
                name=name,
                upstox_user_id=upstox_user_id,
                upstox_access_token=access_token,
                broker_connected=True,
            )
            db.add(user)

        await db.commit()
        await db.refresh(user)

        # Create JWT
        jwt_token = create_access_token(user.id)

        return APIResponse(
            data=TokenResponse(
                access_token=jwt_token,
                user=UserResponse(
                    id=user.id,
                    email=user.email,
                    name=user.name,
                    broker_connected=user.broker_connected,
                    created_at=user.created_at.isoformat(),
                ),
            ),
            message="Login successful",
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}",
        )


@router.get("/me", response_model=APIResponse[UserResponse])
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile"""
    return APIResponse(
        data=UserResponse(
            id=current_user.id,
            email=current_user.email,
            name=current_user.name,
            broker_connected=current_user.broker_connected,
            created_at=current_user.created_at.isoformat(),
        )
    )
