"""
TradeNova Backend — User Model
Stores user profile and Upstox tokens
"""

import uuid
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.models.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """User account linked to Upstox"""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255), default="")

    # Upstox OAuth tokens (encrypted in production)
    upstox_user_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    upstox_access_token: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    upstox_token_expiry: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Account status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    broker_connected: Mapped[bool] = mapped_column(Boolean, default=False)

    def __repr__(self) -> str:
        return f"<User {self.email}>"
