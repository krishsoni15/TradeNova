import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { UpstoxCallbackPayload } from "@/types/auth";

/**
 * Authentication hook
 * Combines Zustand store with TanStack mutations
 */
export function useAuth() {
  const { token, user, isAuthenticated, login, logout } = useAuthStore();

  /** Login with Upstox auth code */
  const loginMutation = useMutation({
    mutationFn: (payload: UpstoxCallbackPayload) =>
      authService.loginWithUpstox(payload),
    onSuccess: (data) => {
      login(data.access_token, data.user);
    },
  });

  /** Redirect to Upstox OAuth */
  const redirectToUpstox = () => {
    const url = authService.getUpstoxAuthUrl();
    window.location.href = url;
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    loginMutation,
    redirectToUpstox,
  };
}
