"""
TradeNova Backend — Configuration
Loads environment variables via Pydantic Settings
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables / .env file"""

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/tradenova"

    # JWT Authentication
    SECRET_KEY: str = "change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 24

    # Upstox API
    UPSTOX_API_KEY: str = ""
    UPSTOX_API_SECRET: str = ""
    UPSTOX_REDIRECT_URI: str = "http://localhost:3000/auth/callback"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — only reads .env once"""
    return Settings()
