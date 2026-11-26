import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DestinationType } from "../../types/destination.types";

type DestinationState = {
  items: DestinationType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: DestinationState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchDestinations = createAsyncThunk<
  DestinationType[],
  void,
  {
    state: { destinations: DestinationState };
    rejectValue: string;
  }
>(
  "destinations/fetchAll",
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await fetch("/api/destinations", {
        method: "GET",
        signal,
      });

      const data = await response.json();
      // console.log("Response /api/destinations:", data);

      if (!response.ok) {
        return rejectWithValue(
          typeof data.message === "string"
            ? data.message
            : "Không thể tải danh sách địa điểm.",
        );
      }

      if (!Array.isArray(data.data)) {
        return rejectWithValue("Dữ liệu danh sách địa điểm không hợp lệ.");
      }

      return data.data as DestinationType[];
    } catch {
      return rejectWithValue("Không thể tải địa điểm. Vui lòng thử lại.");
    }
  },
  {
    // Không gọi lại khi đang tải hoặc đã có dữ liệu.
    condition: (_, { getState }) => {
      const { status } = getState().destinations;

      return status === "idle" || status === "failed";
    },
  },
);

const destinationSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Không thể tải danh sách địa điểm.";
      });
  },
});

export default destinationSlice.reducer;
