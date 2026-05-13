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

/** Paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/** API error response */
export interface ApiError {
  status: "error";
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
