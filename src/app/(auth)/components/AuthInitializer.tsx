"use client";

import { useEffect } from "react";
import type { ApiError, ApiSuccess } from "@/lib/api-response";
import { useAppStore } from "@/redux/hooks";
import {
  setUser,
  clearUser,
  sessionCheckFailed,
} from "@/app/(auth)/store/slices/authSlice";

type SessionResult = ApiSuccess<{ email: string }> | ApiError;

export default function AuthInitializer() {
  const store = useAppStore();

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    // Không để trạng thái checking kéo dài nếu mất kết nối.
    const timeout = window.setTimeout(() => {
      controller.abort();
    }, 10_000);

    async function restoreSession() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });

        // Không ghi đè nếu người dùng vừa đăng nhập trong lúc chờ.
        if (!active || store.getState().auth.status !== "checking") {
          return;
        }

        if (response.status === 401) {
          store.dispatch(clearUser());
          return;
        }

        if (!response.ok) {
          throw new Error("Không thể kiểm tra phiên.");
        }

        const body: SessionResult = await response.json();

        if (!active || store.getState().auth.status !== "checking") {
          return;
        }

        if (
          !body.success ||
          typeof body.data?.email !== "string" ||
          !body.data.email
        ) {
          throw new Error("Phản hồi phiên không hợp lệ.");
        }

        store.dispatch(setUser({ email: body.data.email }));
      } catch {
        if (active && store.getState().auth.status === "checking") {
          store.dispatch(sessionCheckFailed());
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void restoreSession();

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [store]);

  return null;
}
