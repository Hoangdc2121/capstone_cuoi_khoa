import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { BookingPayload, BookingType } from "../types/booking.types";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

type BookingState = {
  items: BookingType[];
  listStatus: RequestStatus;
  listError: string | null;
  createStatus: RequestStatus;
  createError: string | null;
};

const initialState: BookingState = {
  items: [],
  listStatus: "idle",
  listError: null,
  createStatus: "idle",
  createError: null,
};

type ThunkConfig = {
  state: {
    booking: BookingState;
  };
  rejectValue: string;
};

type CreateBookingInput = Omit<BookingPayload, "maNguoiDung">;

type BookingApiResult = {
  success?: boolean;
  data?: unknown;
  message?: string;
  error?: {
    message?: unknown;
  };
};

export const fetchBookings = createAsyncThunk<BookingType[], void, ThunkConfig>(
  "booking/fetchAll",
  async (_, { rejectWithValue, signal }) => {
    try {
      const res = await fetch("/api/booking", {
        method: "GET",
        cache: "no-store",
        signal,
      });

      const result: BookingApiResult | null = await res
        .json()
        .catch(() => null);

      if (!res.ok || result?.success !== true) {
        return rejectWithValue(
          typeof result?.error?.message === "string"
            ? result.error.message
            : "Không thể tải danh sách đặt phòng.",
        );
      }

      if (!Array.isArray(result.data)) {
        return rejectWithValue("Dữ liệu danh sách đặt phòng không hợp lệ.");
      }

      return result.data as BookingType[];
    } catch {
      return rejectWithValue(
        "Không thể tải danh sách đặt phòng. Vui lòng thử lại.",
      );
    }
  },
  {
    condition: (_, { getState }) => getState().booking.listStatus !== "loading",
  },
);

export const createBooking = createAsyncThunk<
  string | undefined,
  CreateBookingInput,
  ThunkConfig
>(
  "booking/create",
  async (input, { rejectWithValue }) => {
    const unknownResultMessage =
      "Chưa nhận được kết quả đặt phòng. Hãy kiểm tra Chuyến đi trước khi gửi lại.";

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (res.status === 401) {
        return rejectWithValue("Vui lòng đăng nhập để đặt phòng.");
      }

      const result: BookingApiResult | null = await res
        .json()
        .catch(() => null);

      if (!res.ok || result?.success !== true) {
        return rejectWithValue(
          typeof result?.error?.message === "string"
            ? result.error.message
            : unknownResultMessage,
        );
      }

      return result.message;
    } catch {
      return rejectWithValue(unknownResultMessage);
    }
  },
  {
    condition: (_, { getState }) =>
      getState().booking.createStatus !== "loading",
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.items = action.payload;
        state.listStatus = "succeeded";
        state.listError = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.listStatus = action.meta.aborted ? "idle" : "failed";
        state.listError = action.meta.aborted
          ? null
          : (action.payload ?? "Không thể tải danh sách đặt phòng.");
      })
      .addCase(createBooking.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.createStatus = "succeeded";
        state.createError = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          action.payload ?? "Không thể xác nhận kết quả đặt phòng.";
      });
  },
});

export default bookingSlice.reducer;
