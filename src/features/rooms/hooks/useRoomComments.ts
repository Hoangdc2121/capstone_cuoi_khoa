"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { fetchCommentsByRoom } from "../store/commentSlice";
import type { RoomCommentType } from "../types/comment.types";

const EMPTY_COMMENTS: RoomCommentType[] = [];

export default function useRoomComments(
  roomId: number,
  enabled: boolean,
) {
  const dispatch = useAppDispatch();

  const invalidRoomId =
    !Number.isSafeInteger(roomId) || roomId <= 0;

  const cached = useAppSelector(
    (state) => state.comments.byRoom[roomId],
  );

  const comments = cached?.items ?? EMPTY_COMMENTS;
  const status = cached?.status ?? "idle";
  const error = cached?.error ?? null;

  useEffect(() => {
    if (!enabled || invalidRoomId || status !== "idle") {
      return;
    }

    void dispatch(fetchCommentsByRoom(roomId));
  }, [dispatch, roomId, enabled, invalidRoomId, status]);

  function retry() {
    if (
      !enabled ||
      invalidRoomId ||
      status === "loading"
    ) {
      return;
    }

    void dispatch(fetchCommentsByRoom(roomId));
  }

  return {
    comments,
    status,
    loading:
      enabled &&
      !invalidRoomId &&
      (status === "idle" || status === "loading"),
    error: invalidRoomId ? "Mã phòng không hợp lệ." : error,
    invalidRoomId,
    retry,
  };
}