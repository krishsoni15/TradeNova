import { NextResponse } from "next/server";

/**
 * GET /api/v1/health
 * Health check endpoint — verifies the API is running.
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "TradeNova API (Next.js)",
    version: "1.0.0",
    upstox: process.env.UPSTOX_API_KEY ? "configured" : "mock_mode",
    timestamp: new Date().toISOString(),
  });
}
