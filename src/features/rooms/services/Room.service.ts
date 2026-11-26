import "server-only";

import { apiFetch, type ApiResponse } from "@/lib/api-fetch";
import { API_CONFIG } from "@/config/api.config";

import type { RoomType } from "../types/room.types";

export const RoomService = {
  // Tất cả phòng.
  getAll() {
    return apiFetch<ApiResponse<RoomType[]>>(
      API_CONFIG.ENPOINTS.Rooms.GET_ALL,
      { method: "GET" },
    );
  },

  // Phòng thuộc khu vực được chọn.
  getByLocation(destinationId: number) {
    return apiFetch<ApiResponse<RoomType[]>>(
      API_CONFIG.ENPOINTS.Rooms.GET_BY_LOCATION(destinationId),
      { method: "GET" },
    );
  },

  // chi tiết phòng
  getById(roomId: number) {
    return apiFetch<ApiResponse<RoomType>>(
      API_CONFIG.ENPOINTS.Rooms.GET_BY_ID(roomId),
      { method: "GET" },
    );
  },
};
