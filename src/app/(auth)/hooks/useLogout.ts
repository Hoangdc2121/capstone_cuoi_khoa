import { ApiError, ApiSuccess } from "@/lib/api-response";
import { useAppDispatch } from "@/redux/hooks";
import { clearUser } from "@/app/(auth)/store/slices/authSlice";
import { notifyError, notifySuccess } from "@/utils/notification";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type LogoutResult = ApiSuccess<null> | ApiError;

export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);

  async function logout() {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const body: LogoutResult = await res.json();

      if (!body.success) {
        notifyError(body.error.message);
        return;
      }

      if (!res.ok) {
        notifyError("Không thể đăng xuất, vui lòng thử lại.");
        return;
      }

      dispatch(clearUser());
      notifySuccess(body.message ?? "Đăng xuất thành công!");
    } catch (error) {
      notifyError("Không thể kết nối, vui lòng thử lại.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  return { logout, pending };
}
