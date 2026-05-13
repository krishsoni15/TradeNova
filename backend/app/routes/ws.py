"""
TradeNova Backend — WebSocket Routes (Scaffold)
Placeholder for future live market data streaming
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/market")
async def market_data_ws(websocket: WebSocket):
    """
    WebSocket endpoint for live market data streaming.
    Phase 1: Scaffold only — echoes messages back.
    Phase 2: Will connect to Upstox WebSocket for live ticks.
    """
    await websocket.accept()
    logger.info("WebSocket client connected")

    try:
        while True:
            data = await websocket.receive_text()
            # Phase 1: Echo back with status
            await websocket.send_json({
                "status": "received",
                "message": "WebSocket is ready — live data coming in Phase 2",
                "data": data,
            })
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
