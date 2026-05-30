import { NextResponse } from "next/server";
import { sessions } from "@/lib/session";

/**
 * GET /api/v1/auth/me
 * Returns the currently authenticated user's profile.
 * Token is passed via Authorization: Bearer <token> header.
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { status: "error", detail: "Not authenticated — missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { status: "error", detail: "Empty token" },
        { status: 401 }
      );
    }

    const user = sessions.get(token);

    if (!user) {
      return NextResponse.json(
        { status: "error", detail: "Invalid or expired token. Please log in again." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        broker_connected: user.broker_connected,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    console.error("[Auth/Me] Error:", error);
    return NextResponse.json(
      { status: "error", detail: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
