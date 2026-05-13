"""
TradeNova Backend — Database Setup
Async SQLAlchemy engine + session factory
"""

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)
from app.config import get_settings

settings = get_settings()

# Async engine with connection pooling
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

# Session factory
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    """FastAPI dependency — provides async database session"""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
