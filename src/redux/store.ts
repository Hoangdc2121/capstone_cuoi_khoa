import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../app/(auth)/store/slices/authSlice";
import destinationReducer from "../features/destinations/store/slice/destinationSlice"
import roomReducer from "../features/rooms/store/roomSlice"
import commentReducer from "@/features/rooms/store/commentSlice";
import bookingReducer from "@/features/booking/store/bookingSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      destinations: destinationReducer,
      rooms: roomReducer,
      comments: commentReducer,
      booking: bookingReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];