import { NextResponse } from "next/server";
import { getPositions } from "@/lib/upstox";
import { sessions } from "@/lib/session";

/**
 * GET /api/v1/positions
 * Returns portfolio active/intraday F&O positions.
 * If authenticated with Upstox token -> fetches real positions from Upstox.
 * Otherwise -> returns high quality mock positions.
 */
export async function GET(req: Request) {
  try {
    let upstoxToken: string | undefined;

    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const user = sessions.get(token);
      if (user?.upstox_access_token) {
        upstoxToken = user.upstox_access_token;
      }
    }

    const positions = await getPositions(upstoxToken);

    return NextResponse.json({
      status: "success",
      data: positions,
      message: `Found ${positions.length} active positions`,
    });
  } catch (error: any) {
    console.error("[Positions API] Error:", error);
    return NextResponse.json(
      { status: "error", detail: "Failed to fetch positions", data: [] },
      { status: 500 }
    );
  }
}
