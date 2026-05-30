/**
 * In-memory session management for Next.js API routes.
 *
 * Sessions are stored in a global Map to persist across hot reloads in dev mode.
 * In production, consider using a database or Redis for session persistence.
 */

export type User = {
  id: string;
  email: string;
  name: string;
  upstox_user_id: string;
  upstox_access_token: string;
  broker_connected: boolean;
  created_at: string;
};

// Use globalThis to persist sessions across hot reloads in development
const globalForSessions = globalThis as unknown as {
  __tradenova_sessions: Map<string, User>;
};

export const sessions: Map<string, User> =
  globalForSessions.__tradenova_sessions || new Map<string, User>();

if (process.env.NODE_ENV !== "production") {
  globalForSessions.__tradenova_sessions = sessions;
}

/**
 * Generate a cryptographically-adequate random token.
 * Not a real JWT — just a random string for session identification.
 */
export function createToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token + "_" + Date.now().toString(36);
}
