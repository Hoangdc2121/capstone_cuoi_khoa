import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import type { RoomType } from "../types/room.types";

type RoomListState = {
  items: RoomType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

type RoomDetailState = {
  room: RoomType | null;
  status: RoomListState["status"];
  error: string | null;
};

type RoomState = RoomListState & {
  byLocation: Record<number, RoomListState>;
  byId: Partial<Record<number, RoomDetailState>>;
};

const initialState: RoomState = {
  items: [],
  status: "idle",
  error: null,
  byLocation: {},
  byId: {},
};

type ThunkConfig = {
  state: { rooms: RoomState };
  rejectValue: string;
};

// Tất cả phòng: dùng cho Home và lựa chọn “Tất cả”.
export const fetchRooms = createAsyncThunk<RoomType[], void, ThunkConfig>(
  "rooms/fetchAll",
  async (_, { rejectWithValue, signal }) => {
    try {
      const res = await fetch("/api/rooms", {
        method: "GET",
        signal,
      });

      const result = await res.json();

      if (!res.ok || result.success !== true) {
        return rejectWithValue("Không thể tải danh sách phòng.");
      }

      if (!Array.isArray(result.data)) {
        return rejectWithValue("Dữ liệu danh sách phòng không hợp lệ.");
      }

      return result.data as RoomType[];
    } catch {
      return rejectWithValue("Không thể tải phòng. Vui lòng thử lại.");
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().rooms;

      // Chặn gọi trùng khi đang tải hoặc đã có dữ liệu.
      return status === "idle" || status === "failed";
    },
  },
);

export const fetchRoomsByLocation = createAsyncThunk<
  RoomType[],
  number,
  ThunkConfig
>(
  "rooms/fetchByLocation",
  async (destinationId, { rejectWithValue, signal }) => {
    if (!Number.isSafeInteger(destinationId) || destinationId <= 0) {
      return rejectWithValue("Mã khu vực không hợp lệ.");
    }

    try {
      const params = new URLSearchParams({
        destinationId: String(destinationId),
      });

      const res = await fetch(`/api/rooms?${params.toString()}`, {
        method: "GET",
        signal,
      });

      const result = await res.json();

      if (!res.ok || result.success !== true) {
        return rejectWithValue("Không thể tải phòng tại khu vực này.");
      }

      if (!Array.isArray(result.data)) {
        return rejectWithValue("Dữ liệu danh sách phòng không hợp lệ.");
      }

      return result.data as RoomType[];
    } catch {
      return rejectWithValue("Không thể tải phòng. Vui lòng thử lại.");
    }
  },
  {
    condition: (destinationId, { getState }) => {
      const cached = getState().rooms.byLocation[destinationId];

      return !cached || cached.status === "idle" || cached.status === "failed";
    },
  },
);

// Chi tiết phòng, lưu riêng theo ID.
export const fetchRoomById = createAsyncThunk<RoomType, number, ThunkConfig>(
  "rooms/fetchById",
  async (roomId, { rejectWithValue, signal }) => {
    if (!Number.isSafeInteger(roomId) || roomId <= 0) {
      return rejectWithValue("Mã phòng không hợp lệ.");
    }

    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "GET",
        signal,
      });

      const result = await res.json();

      if (!res.ok || result.success !== true) {
        return rejectWithValue(
          res.status === 404
            ? "Phòng không tồn tại hoặc đã bị xóa."
            : "Không thể tải chi tiết phòng.",
        );
      }

      const room = result.data;

      if (
        typeof room !== "object" ||
        room === null ||
        Array.isArray(room) ||
        room.id !== roomId ||
        typeof room.tenPhong !== "string"
      ) {
        return rejectWithValue("Dữ liệu chi tiết phòng không hợp lệ.");
      }

      return room as RoomType;
    } catch {
      return rejectWithValue("Không thể tải chi tiết phòng. Vui lòng thử lại.");
    }
  },
  {
    condition: (roomId, { getState }) => {
      const cached = getState().rooms.byId[roomId];

      // Chặn gọi trùng khi đang tải hoặc đã tải thành công.
      return !cached || cached.status === "idle" || cached.status === "failed";
    },
  },
);

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tất cả phòng.
      .addCase(fetchRooms.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = action.meta.aborted ? "idle" : "failed";
        state.error = action.meta.aborted
          ? null
          : (action.payload ?? "Không thể tải danh sách phòng.");
      })

      // Phòng theo khu vực.
      .addCase(fetchRoomsByLocation.pending, (state, action) => {
        const destinationId = action.meta.arg;

        state.byLocation[destinationId] = {
          items: state.byLocation[destinationId]?.items ?? [],
          status: "loading",
          error: null,
        };
      })
      .addCase(fetchRoomsByLocation.fulfilled, (state, action) => {
        state.byLocation[action.meta.arg] = {
          items: action.payload,
          status: "succeeded",
          error: null,
        };
      })
      .addCase(fetchRoomsByLocation.rejected, (state, action) => {
        const destinationId = action.meta.arg;

        state.byLocation[destinationId] = {
          items: state.byLocation[destinationId]?.items ?? [],
          status: action.meta.aborted ? "idle" : "failed",
          error: action.meta.aborted
            ? null
            : (action.payload ?? "Không thể tải phòng tại khu vực này."),
        };
      });

    // Chi tiết phòng.
    builder
      .addCase(fetchRoomById.pending, (state, action) => {
        const roomId = action.meta.arg;

        state.byId[roomId] = {
          room: state.byId[roomId]?.room ?? null,
          status: "loading",
          error: null,
        };
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.byId[action.meta.arg] = {
          room: action.payload,
          status: "succeeded",
          error: null,
        };
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        const roomId = action.meta.arg;

        state.byId[roomId] = {
          room: state.byId[roomId]?.room ?? null,
          status: action.meta.aborted ? "idle" : "failed",
          error: action.meta.aborted
            ? null
            : (action.payload ?? "Không thể tải chi tiết phòng."),
        };
      });
  },
});
export default roomSlice.reducer;
