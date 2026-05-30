import apiClient from "./api-client";
import type { AuthResponse, UpstoxCallbackPayload } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

/**
 * Authentication service
 * All API calls go to Next.js API routes (same origin) — no external backend needed.
 */
export const authService = {
  /**
   * Exchange Upstox authorization code for JWT token.
   * POST /api/v1/auth/upstox/callback
   */
  async loginWithUpstox(payload: UpstoxCallbackPayload): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/upstox/callback",
        payload
      );
      return data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Login failed";
      console.error("[Auth] loginWithUpstox failed:", message);
      throw new Error(message);
    }
  },

  /**
   * Get current user profile.
   * GET /api/v1/auth/me
   */
  async getProfile(): Promise<AuthResponse["user"]> {
    try {
      const { data } = await apiClient.get<ApiResponse<AuthResponse["user"]>>(
        "/auth/me"
      );
      return data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.message ||
        "Failed to fetch profile";
      console.error("[Auth] getProfile failed:", message);
      throw new Error(message);
    }
  },

  /**
   * Generate Upstox OAuth URL.
   * GET /api/v1/auth/upstox/login
   */
  async getUpstoxAuthUrl(): Promise<string> {
    try {
      const { data } = await apiClient.get<{ url: string }>(
        "/auth/upstox/login"
      );
      return data.url;
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        error.message ||
        "Failed to get auth URL";
      console.error("[Auth] getUpstoxAuthUrl failed:", message);
      throw new Error(message);
    }
  },
};
