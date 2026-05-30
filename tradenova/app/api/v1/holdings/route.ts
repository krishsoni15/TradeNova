import { NextResponse } from "next/server";
import { getHoldings } from "@/lib/upstox";
import { sessions } from "@/lib/session";

/**
 * GET /api/v1/holdings
 * Returns portfolio holdings.
 * If authenticated with Upstox token → fetches real holdings from Upstox.
 * Otherwise → returns mock data for development/demo.
 */
export async function GET(req: Request) {
  try {
    // Try to extract user from auth header
    let upstoxToken: string | undefined;

    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const user = sessions.get(token);
      if (user?.upstox_access_token) {
        upstoxToken = user.upstox_access_token;
      }
    }

    const holdings = await getHoldings(upstoxToken);

    return NextResponse.json({
      status: "success",
      data: holdings,
      message: `Found ${holdings.summary.total_holdings} holdings`,
    });
  } catch (error: any) {
    console.error("[Holdings] Error:", error);
    return NextResponse.json(
      { status: "error", detail: "Failed to fetch holdings", data: null },
      { status: 500 }
    );
  }
}
