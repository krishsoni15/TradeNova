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
  getUpstoxAuthUrl(): string {
    const baseUrl = "https://api.upstox.com/v2/login/authorization/dialog";
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_UPSTOX_API_KEY || "",
      redirect_uri:
        process.env.NEXT_PUBLIC_UPSTOX_REDIRECT_URI ||
        "http://localhost:3000/auth/callback",
    });
    return `${baseUrl}?${params.toString()}`;
  },
};
