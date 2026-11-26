"use client";

import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";

// Gửi action để cập nhật state.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Đọc một phần state và cập nhật giao diện khi phần đó thay đổi.
export const useAppSelector = useSelector.withTypes<RootState>();

// Lấy trực tiếp đối tượng store.
export const useAppStore = useStore.withTypes<AppStore>();