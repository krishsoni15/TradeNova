import apiClient from "./api-client";
import type { ApiResponse } from "@/types/api";

export interface Position {
  symbol: string;
  exchange: string;
  type: "CALL" | "PUT" | "EQ";
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  pnlPct: number;
}

export const positionsService = {
  async getPositions(): Promise<Position[]> {
    const { data } = await apiClient.get<ApiResponse<Position[]>>(
      "/positions"
    );
    return data.data;
  },
};
