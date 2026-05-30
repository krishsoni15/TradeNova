import { NextResponse } from "next/server";

/**
 * GET /api/v1/auth/upstox/login
 * Returns the Upstox OAuth authorization URL.
 * The frontend redirects the user to this URL.
 */
export async function GET() {
  const clientId = process.env.UPSTOX_API_KEY || process.env.NEXT_PUBLIC_UPSTOX_API_KEY || "";
  const redirectUri = process.env.UPSTOX_REDIRECT_URI || process.env.NEXT_PUBLIC_UPSTOX_REDIRECT_URI || "http://localhost:3000/auth/callback";

  if (!clientId) {
    return NextResponse.json(
      { error: "Upstox API keys not configured. Set UPSTOX_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  const authUrl = [
    "https://api.upstox.com/v2/login/authorization/dialog",
    `?response_type=code`,
    `&client_id=${clientId}`,
    `&redirect_uri=${encodeURIComponent(redirectUri)}`,
  ].join("");

  return NextResponse.json({ url: authUrl });
}
