import { create } from "zustand";

/**
 * UI state store (Zustand)
 * Manages sidebar visibility and global UI state
 */
interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  /** Toggle mobile sidebar (sheet) */
  toggleSidebar: () => void;
  /** Set sidebar open state */
  setSidebarOpen: (open: boolean) => void;
  /** Toggle desktop sidebar collapse */
  toggleCollapse: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleCollapse: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
