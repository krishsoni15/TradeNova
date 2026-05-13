"""
TradeNova Backend — Common Schemas
Generic API response wrappers
"""

from typing import Generic, TypeVar, Optional
from pydantic import BaseModel
from datetime import datetime, timezone

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard API response wrapper"""

    status: str = "success"
    data: T
    message: Optional[str] = None
    timestamp: str = ""

    def __init__(self, **data):
        if not data.get("timestamp"):
            data["timestamp"] = datetime.now(timezone.utc).isoformat()
        super().__init__(**data)


class ErrorResponse(BaseModel):
    """Standard error response"""

    status: str = "error"
    message: str
    code: Optional[str] = None
    timestamp: str = ""

    def __init__(self, **data):
        if not data.get("timestamp"):
            data["timestamp"] = datetime.now(timezone.utc).isoformat()
        super().__init__(**data)
