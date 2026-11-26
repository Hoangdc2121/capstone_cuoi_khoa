import "server-only";

import { apiFetch, type ApiResponse } from "@/lib/api-fetch";
import { API_CONFIG } from "@/config/api.config";

import type {
  CommentPayload,
  CommentType,
  RoomCommentType,
} from "../types/comment.types";

export const CommentService = {
  // Tất cả bình luận.
  getAll() {
    return apiFetch<ApiResponse<CommentType[]>>(
      API_CONFIG.ENPOINTS.comments.GET_ALL,
      { method: "GET" },
    );
  },

  // Bình luận theo phòng.
  getByRoomComments(roomId: number) {
    return apiFetch<ApiResponse<RoomCommentType[]>>(
      API_CONFIG.ENPOINTS.comments.GET_BY_ROOM_COMMENTS(roomId),
      { method: "GET" },
    );
  },

  // Thêm bình luận.
  create(data: CommentPayload, token: string) {
    return apiFetch<ApiResponse<unknown>>(
      API_CONFIG.ENPOINTS.comments.CREATE,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          ...data,
          id: 0,
        }),
      },
    );
  },

  // Sửa bình luận.
  update(commentId: number, data: CommentPayload, token: string) {
    return apiFetch<ApiResponse<unknown>>(
      API_CONFIG.ENPOINTS.comments.UPDATE(commentId),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          ...data,
          id: commentId,
        }),
      },
    );
  },

  // Xóa bình luận.
  delete(commentId: number, token: string) {
    return apiFetch<ApiResponse<unknown>>(
      API_CONFIG.ENPOINTS.comments.DELETE(commentId),
      {
        method: "DELETE",
        headers: {
          token,
        },
      },
    );
  },
};