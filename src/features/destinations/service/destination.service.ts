import "server-only";

import { apiFetch, type ApiResponse } from "@/lib/api-fetch";
import type { DestinationType } from "../types/destination.types";
import { API_CONFIG } from "@/config/api.config";

export const DestinationService = {
  getAll() {
    return apiFetch<ApiResponse<DestinationType[]>>(
      API_CONFIG.ENPOINTS.Destination.GET_ALL,
      {
        method: "GET",
      },
    );
  },
};