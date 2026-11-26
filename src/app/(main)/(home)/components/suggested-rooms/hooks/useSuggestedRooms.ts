"use client";

import { useMemo } from "react";

import type { RoomType } from "@/features/rooms/types/room.types";

export default function useSuggestedRooms(
  rooms: RoomType[],
  limit = 10,
) {
  return useMemo(() => {
    if (limit <= 0) return [];

    const selectedLocations = new Set<number>();
    const suggestedRooms: RoomType[] = [];

    for (const room of rooms) {
      // Bỏ qua phòng chưa có ảnh hoặc đã chọn khu vực này.
      if (
        !room.hinhAnh?.trim() ||
        selectedLocations.has(room.maViTri)
      ) {
        continue;
      }

      selectedLocations.add(room.maViTri);
      suggestedRooms.push(room);

      if (suggestedRooms.length >= limit) {
        break;
      }
    }

    return suggestedRooms;
  }, [rooms, limit]);
}