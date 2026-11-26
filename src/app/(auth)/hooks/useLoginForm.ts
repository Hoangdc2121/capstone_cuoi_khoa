"use client";
import { useRef, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/validations/auth.schema";
import type { ApiError, ApiSuccess } from "@/lib/api-response";
import { notifyError, notifySuccess } from "@/utils/notification";
import { SignInPayload } from "@/app/(auth)/types/auth.type";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/app/(auth)/store/slices/authSlice";

type FieldErrors = Partial<Record<keyof SignInPayload, string>>;

type LoginResult = ApiSuccess<{ email: string }> | ApiError;

export function useLoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const submitting = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  function validateField(field: keyof SignInPayload, value: string) {
    const result = signInSchema.shape[field].safeParse(value);

    setErrors((current) => ({
      ...current,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting.current) return;

    const result = signInSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field === "email" || field === "password") {
          fieldErrors[field] ??= issue.message;
        }
      }

      setErrors(fieldErrors);

      const firstField = result.error.issues[0]?.path[0];

      if (firstField === "email" || firstField === "password") {
        document.getElementById(`login-${firstField}`)?.focus();
      }

      return;
    }

    setErrors({});
    submitting.current = true;
    setPending(true);

    try {
      // Gọi Route Handler Next.js, không gọi AuthService từ trình duyệt.
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const body: LoginResult = await response.json();

      if (!body.success) {
        notifyError(body.error.message);
        return;
      }

      if (!response.ok) {
        notifyError("Không thể đăng nhập, vui lòng thử lại.");
        return;
      }

      dispatch(setUser(body.data));

      notifySuccess(body.message ?? "Đăng nhập thành công!");

      router.replace("/");
      router.refresh();
    } catch {
      notifyError("Không thể kết nối, vui lòng thử lại.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    pending,
    handleSubmit,
    validateField,
  };
}
