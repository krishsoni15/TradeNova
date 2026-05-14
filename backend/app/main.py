"""
TradeNova Backend — Main Application
FastAPI application with CORS, routers, and lifespan management
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes import auth_router, holdings_router, ws_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown events"""
    logger.info("🚀 TradeNova Backend starting up...")
    logger.info(f"   Debug mode: {settings.DEBUG}")
    logger.info(f"   Upstox API: {'configured' if settings.UPSTOX_API_KEY else 'mock mode'}")
    
    # Create DB tables
    from app.database import engine
    from app.models.base import Base
    # Import all models here so they are registered with Base
    from app.models.user import User
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    yield
    logger.info("👋 TradeNova Backend shutting down...")


# Create FastAPI application
app = FastAPI(
    title="TradeNova API",
    description="Professional trading dashboard API with Upstox integration",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ============================================
# CORS Middleware — allow frontend origin
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Register Routers
# ============================================
app.include_router(auth_router, prefix="/api/v1")
app.include_router(holdings_router, prefix="/api/v1")
app.include_router(ws_router)


# ============================================
# Health Check
# ============================================
@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "TradeNova API",
        "version": "1.0.0",
        "upstox": "connected" if settings.UPSTOX_API_KEY else "mock_mode",
    }


@app.get("/")
async def root():
    """Root endpoint — API info"""
    return {
        "name": "TradeNova API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/api/v1/health",
    }
