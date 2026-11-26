import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { CommentType, RoomCommentType } from "../types/comment.types";

type CommentListState<T> = {
  items: T[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

type CommentState = CommentListState<CommentType> & {
  byRoom: Partial<Record<number, CommentListState<RoomCommentType>>>;
};

const initialState: CommentState = {
  items: [],
  status: "idle",
  error: null,
  byRoom: {},
};

type ThunkConfig = {
  state: {
    comments: CommentState;
  };
  rejectValue: string;
};

// Tất cả bình luận: dùng cho trang About sau này.
export const fetchComments = createAsyncThunk<CommentType[], void, ThunkConfig>(
  "comments/fetchAll",
  async (_, { rejectWithValue, signal }) => {
    try {
      const res = await fetch("/api/comments", {
        method: "GET",
        signal,
      });

      const result = await res.json();

      if (!res.ok || result.success !== true) {
        return rejectWithValue("Không thể tải danh sách bình luận.");
      }

      if (!Array.isArray(result.data)) {
        return rejectWithValue("Dữ liệu danh sách bình luận không hợp lệ.");
      }

      return result.data as CommentType[];
    } catch {
      return rejectWithValue("Không thể tải bình luận. Vui lòng thử lại.");
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().comments;

      return status === "idle" || status === "failed";
    },
  },
);

// Bình luận theo phòng: dùng cho trang chi tiết.
export const fetchCommentsByRoom = createAsyncThunk<
  RoomCommentType[],
  number,
  ThunkConfig
>(
  "comments/fetchByRoom",
  async (roomId, { rejectWithValue, signal }) => {
    if (!Number.isSafeInteger(roomId) || roomId <= 0) {
      return rejectWithValue("Mã phòng không hợp lệ.");
    }

    try {
      const params = new URLSearchParams({
        roomId: String(roomId),
      });

      const res = await fetch(`/api/comments?${params.toString()}`, {
        method: "GET",
        signal,
      });

      const result = await res.json();

      if (!res.ok || result.success !== true) {
        return rejectWithValue("Không thể tải bình luận của phòng.");
      }

      if (!Array.isArray(result.data)) {
        return rejectWithValue("Dữ liệu bình luận của phòng không hợp lệ.");
      }

      return result.data as RoomCommentType[];
    } catch {
      return rejectWithValue("Không thể tải bình luận. Vui lòng thử lại.");
    }
  },
  {
    condition: (roomId, { getState }) => {
      const cached = getState().comments.byRoom[roomId];

      // Chặn gọi trùng khi đang tải hoặc đã tải thành công.
      return !cached || cached.status === "idle" || cached.status === "failed";
    },
  },
);
type CreateCommentInput = Pick<
  CommentType,
  "maPhong" | "noiDung" | "saoBinhLuan"
>;

type DeleteCommentInput = {
  commentId: number;
  roomId: number;
};

type CommentApiResult = {
  success?: boolean;
  message?: unknown;
  data?: unknown;
  error?: {
    message?: unknown;
  };
};

type CommentMutationResult = {
  data: unknown;
  toast: string;
};

function getCommentToastText(
  message: unknown,
  content: unknown,
  fallback: string,
): string {
  const texts = [message, content].filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );

  return [...new Set(texts)].join(" — ") || fallback;
}

export const createComment = createAsyncThunk<
  CommentMutationResult & { roomId: number },
  CreateCommentInput,
  ThunkConfig
>("comments/create", async (input, { rejectWithValue }) => {
  const fallback = "Không thể gửi bình luận. Vui lòng thử lại.";

  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const result: CommentApiResult | null = await res.json().catch(() => null);

    if (!res.ok || result?.success !== true) {
      return rejectWithValue(
        getCommentToastText(
          result?.error?.message,
          result?.data,
          res.status === 401
            ? "Vui lòng đăng nhập để gửi bình luận."
            : fallback,
        ),
      );
    }

    return {
      roomId: input.maPhong,
      data: result.data,
      toast: getCommentToastText(
        result.message,
        result.data,
        "Gửi bình luận thành công!",
      ),
    };
  } catch {
    return rejectWithValue(
      "Không thể gửi bình luận. Vui lòng kiểm tra kết nối và thử lại.",
    );
  }
});

export const deleteComment = createAsyncThunk<
  CommentMutationResult & DeleteCommentInput,
  DeleteCommentInput,
  ThunkConfig
>("comments/delete", async (input, { rejectWithValue }) => {
  if (
    !Number.isSafeInteger(input.commentId) ||
    input.commentId <= 0 ||
    !Number.isSafeInteger(input.roomId) ||
    input.roomId <= 0
  ) {
    return rejectWithValue("Thông tin bình luận không hợp lệ.");
  }

  const fallback = "Không thể xóa bình luận. Vui lòng thử lại.";

  try {
    const res = await fetch(`/api/comments/${input.commentId}`, {
      method: "DELETE",
    });

    if (!res.headers.get("content-type")?.includes("application/json")) {
      return rejectWithValue(
        "API xóa bình luận trả về phản hồi không hợp lệ.",
      );
    }

    const result: CommentApiResult | null = await res.json().catch(() => null);

    if (!res.ok || result?.success !== true) {
      return rejectWithValue(
        getCommentToastText(result?.error?.message, result?.data, fallback),
      );
    }

    return {
      ...input,
      data: result.data,
      toast: getCommentToastText(
        result.message,
        result.data,
        "Xóa bình luận thành công!",
      ),
    };
  } catch {
    return rejectWithValue(fallback);
  }
});
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tất cả bình luận.
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = action.meta.aborted ? "idle" : "failed";
        state.error = action.meta.aborted
          ? null
          : (action.payload ?? "Không thể tải danh sách bình luận.");
      })

      // Bình luận theo từng phòng.
      .addCase(fetchCommentsByRoom.pending, (state, action) => {
        const roomId = action.meta.arg;

        state.byRoom[roomId] = {
          items: state.byRoom[roomId]?.items ?? [],
          status: "loading",
          error: null,
        };
      })
      .addCase(fetchCommentsByRoom.fulfilled, (state, action) => {
        state.byRoom[action.meta.arg] = {
          items: action.payload,
          status: "succeeded",
          error: null,
        };
      })
      .addCase(fetchCommentsByRoom.rejected, (state, action) => {
        const roomId = action.meta.arg;

        state.byRoom[roomId] = {
          items: state.byRoom[roomId]?.items ?? [],
          status: action.meta.aborted ? "idle" : "failed",
          error: action.meta.aborted
            ? null
            : (action.payload ?? "Không thể tải bình luận của phòng."),
        };
      })

      // Gửi thành công: đánh dấu dữ liệu cần tải lại.
      .addCase(createComment.fulfilled, (state, action) => {
        const {roomId} = action.payload;
        const cached = state.byRoom[roomId];

        if (cached) {
          cached.status = "idle";
          cached.error = null;
        }

        state.status = "idle";
        state.error = null;
      })

      // Xóa thành công: cập nhật danh sách.
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, roomId } = action.payload;
        const cached = state.byRoom[roomId];

        if (cached) {
          cached.items = cached.items.filter(
            (comment) => comment.id !== commentId,
          );
        }

        state.items = state.items.filter(
          (comment) => comment.id !== commentId,
        );
      });
  },
});

export default commentSlice.reducer;

