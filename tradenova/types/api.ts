/**
 * Generic API response types
 */

/** Standard API response wrapper */
export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
  timestamp: string;
}


