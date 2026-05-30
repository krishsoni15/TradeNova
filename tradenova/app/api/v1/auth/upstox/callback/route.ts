import { NextResponse } from "next/server";
import { exchangeUpstoxCode, getUpstoxProfile } from "@/lib/upstox";
import { sessions, createToken, type User } from "@/lib/session";

/**
 * POST /api/v1/auth/upstox/callback
 * Exchange Upstox authorization code for access token.
 * Creates or updates user session, returns JWT-like token.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.code) {
      return NextResponse.json(
        { detail: "Missing authorization code in request body" },
        { status: 400 }
      );
    }

    const { code } = body;

    // Exchange the authorization code for an Upstox access token
    let tokenData: any;
    try {
      tokenData = await exchangeUpstoxCode(code);
    } catch (err: any) {
      console.error("[Auth] Failed to exchange code:", err.message);
      return NextResponse.json(
        { detail: `Upstox token exchange failed: ${err.message}` },
        { status: 502 }
      );
    }

    const accessToken = tokenData?.access_token;
    if (!accessToken) {
      return NextResponse.json(
        { detail: "Upstox did not return an access token" },
        { status: 400 }
      );
    }

    // Fetch the user's profile from Upstox
    let profile: any;
    try {
      profile = await getUpstoxProfile(accessToken);
    } catch (err: any) {
      console.error("[Auth] Failed to fetch profile:", err.message);
      return NextResponse.json(
        { detail: `Failed to fetch Upstox profile: ${err.message}` },
        { status: 502 }
      );
    }

    const email = profile.email || "";
    const name = profile.user_name || "";
    const upstoxUserId = profile.user_id || "";

    // Find existing user by email or create new one
    let foundUser: User | undefined;
    let existingToken = "";

    for (const [t, u] of Array.from(sessions.entries())) {
      if (u.email === email) {
        foundUser = u;
        existingToken = t;
        break;
      }
    }

    let jwtToken: string;

    if (foundUser) {
      // Update existing user's token
      foundUser.upstox_access_token = accessToken;
      foundUser.upstox_user_id = upstoxUserId;
      foundUser.name = name;
      foundUser.broker_connected = true;
      jwtToken = existingToken || createToken();
      sessions.set(jwtToken, foundUser);
    } else {
      // Create new user
      foundUser = {
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        email,
        name,
        upstox_user_id: upstoxUserId,
        upstox_access_token: accessToken,
        broker_connected: true,
        created_at: new Date().toISOString(),
      };
      jwtToken = createToken();
      sessions.set(jwtToken, foundUser);
    }

    console.log(`[Auth] User ${email} logged in successfully`);

    return NextResponse.json({
      status: "success",
      message: "Login successful",
      data: {
        access_token: jwtToken,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          broker_connected: foundUser.broker_connected,
          created_at: foundUser.created_at,
        },
      },
    });
  } catch (error: any) {
    console.error("[Auth] Unexpected callback error:", error);
    return NextResponse.json(
      { detail: `Authentication failed: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
