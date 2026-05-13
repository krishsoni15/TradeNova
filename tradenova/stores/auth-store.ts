import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";

/**
 * Authentication store (Zustand)
 * Persisted to localStorage for session continuity
 */
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  /** Set auth data after successful login */
  login: (token: string, user: User) => void;
  /** Clear auth data */
  logout: () => void;
  /** Update user profile data */
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),

      setUser: (user) => set({ user }),
    }),
    {
      name: "tradenova-auth",
      // Only persist token and user, not functions
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
