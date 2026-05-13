/**
 * Authentication type definitions
 */

/** User profile returned from backend */
export interface User {
  id: string;
  email: string;
  name: string;
  broker_connected: boolean;
  created_at: string;
}

/** Login response with JWT token */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

/** Upstox OAuth callback payload */
export interface UpstoxCallbackPayload {
  code: string;
  state?: string;
}
