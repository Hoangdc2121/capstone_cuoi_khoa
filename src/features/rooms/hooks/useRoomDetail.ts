"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { fetchRoomById } from "../store/roomSlice";

export default function useRoomDetail(roomId: number) {
  const dispatch = useAppDispatch();

  const invalidRoomId = !Number.isSafeInteger(roomId) || roomId <= 0;

  const cached = useAppSelector((state) => state.rooms.byId[roomId]);

  const room = cached?.room ?? null;
  const status = cached?.status ?? "idle";
  const error = cached?.error ?? null;

  useEffect(() => {
    if (!invalidRoomId && status === "idle") {
      void dispatch(fetchRoomById(roomId));
    }
  }, [dispatch, roomId, invalidRoomId, status]);

  function retry() {
    if (invalidRoomId || status === "loading") return;

    void dispatch(fetchRoomById(roomId));
  }

  return {
    room,
    loading: !invalidRoomId && (status === "idle" || status === "loading"),
    error: invalidRoomId ? "Mã phòng không hợp lệ." : error,
    invalidRoomId,
    retry,
  };
}
