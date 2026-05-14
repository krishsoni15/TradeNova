import apiClient from "./api-client";
import type { AuthResponse, UpstoxCallbackPayload } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

/**
 * Authentication service
 * Handles Upstox OAuth flow and user profile
 */
export const authService = {
  /**
   * Exchange Upstox authorization code for JWT token
   */
  async loginWithUpstox(payload: UpstoxCallbackPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/upstox/callback",
      payload
    );
    return data.data;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthResponse["user"]> {
    const { data } = await apiClient.get<ApiResponse<AuthResponse["user"]>>(
      "/auth/me"
    );
    return data.data;
  },

  /**
   * Generate Upstox OAuth URL
   */
  async getUpstoxAuthUrl(): Promise<string> {
    const { data } = await apiClient.get<{ url: string }>("/auth/upstox/login");
    return data.url;
  },
};
