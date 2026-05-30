import apiClient from "./api-client";
import type { HoldingsResponse } from "@/types/holdings";
import type { ApiResponse } from "@/types/api";

export const holdingsService = {
  async getHoldings(): Promise<HoldingsResponse> {
    const { data } = await apiClient.get<ApiResponse<HoldingsResponse>>(
      "/holdings"
    );
    return data.data;
  },
};
