"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchRooms, fetchRoomsByLocation } from "../store/roomSlice";
import type { RoomType } from "../types/room.types";

const EMPTY_ROOMS: RoomType[] = [];

export default function useRooms(enabled: boolean, destinationId?: number) {
  const dispatch = useAppDispatch();

  const roomList = useAppSelector((state) =>
    destinationId === undefined
      ? state.rooms
      : state.rooms.byLocation[destinationId],
  );

  const rooms = roomList?.items ?? EMPTY_ROOMS;
  const status = roomList?.status ?? "idle";
  const error = roomList?.error ?? null;

  useEffect(() => {
    if (!enabled || status !== "idle") {
      return;
    }

    if (destinationId === undefined) {
      void dispatch(fetchRooms());
    } else {
      void dispatch(fetchRoomsByLocation(destinationId));
    }
  }, [enabled, destinationId, status, dispatch]);

  function retry() {
    if (!enabled) {
      return;
    }

    if (destinationId === undefined) {
      void dispatch(fetchRooms());
    } else {
      void dispatch(fetchRoomsByLocation(destinationId));
    }
  }

  return {
    rooms,
    loading: enabled && (status === "idle" || status === "loading"),
    error,
    retry,
  };
}
