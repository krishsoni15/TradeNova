import { useUIStore } from "@/stores/ui-store";

/**
 * Sidebar state hook
 * Convenience wrapper around UI store
 */
export function useSidebar() {
  const {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    setSidebarOpen,
    toggleCollapse,
  } = useUIStore();

  return {
    isOpen: sidebarOpen,
    isCollapsed: sidebarCollapsed,
    toggle: toggleSidebar,
    setOpen: setSidebarOpen,
    toggleCollapse,
  };
}
