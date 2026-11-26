"use client";

import { notifyError, notifySuccess } from "@/utils/notification";
import type { ApiError, ApiSuccess } from "@/lib/api-response";

import {
  type SignUpFormValues,
  signUpInfoSchema,
  signUpSchema,
} from "@/validations/auth.schema";
import { useRouter } from "next/navigation";
import { useRef, useState, type SubmitEvent } from "react";
import type { ZodError } from "zod";

// không chọn giới tính thì giữ undefined, khi submit, thì zod sẽ báo lỗi
type RegisterValues = Omit<SignUpFormValues, "gender"> & {
  gender: boolean | undefined;
};

type FieldErrors = Partial<Record<keyof RegisterValues, string>>;

type RegisterResult = ApiSuccess<null> | ApiError;

const initialValues: RegisterValues = {
  name: "",
  email: "",
  phone: "",
  birthday: "",
  gender: undefined,
  password: "",
  confirmPassword: "",
};

// chuyển danh sách lỗi zod sang lỗi theo từng trường

function getFieldErrors(issues: ZodError["issues"]): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of issues) {
    const fied = issue.path[0];

    if (
      typeof fied === "string" &&
      Object.prototype.hasOwnProperty.call(initialValues, fied)
    ) {
      const key = fied as keyof RegisterValues;
      fieldErrors[key] ??= issue.message;
    }
  }
  return fieldErrors;
}

export function useRegisterForm() {
  const router = useRouter();
  const submitting = useRef(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<RegisterValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  //   cập nhật giá trị và xóa lỗi của trường đó
  function setFieldValue<K extends keyof RegisterValues>(
    field: K,
    value: RegisterValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  //   kiểm tra khi người dùng rồi ô

  function validateField(field: keyof RegisterValues) {
    const result = signUpSchema.safeParse(values);

    const message = result.success
      ? undefined
      : result.error.issues.find((issue) => issue.path[0] === field)?.message;

    setErrors((current) => ({
      ...current,
      [field]: message,
    }));
  }

  //   kiểm tra thông tin của bước 1
  function nextStep() {
    if (submitting.current) return;

    const result = signUpInfoSchema.safeParse(values);

    if (!result.success) {
      setErrors(getFieldErrors(result.error.issues));
      return;
    }

    setErrors({});
    setStep(2);
  }

  function previousStep() {
    if (submitting.current) return;

    setErrors({});
    setStep(1);
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting.current) return;

    // Nhấn Enter ở bước 1 chỉ chuyển bước.
    if (step === 1) {
      nextStep();
      return;
    }

    const result = signUpSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = getFieldErrors(result.error.issues);
      setErrors(fieldErrors);

      // Nếu thông tin bước 1 không hợp lệ, quay lại bước đó.
      if (
        fieldErrors.name ||
        fieldErrors.email ||
        fieldErrors.phone ||
        fieldErrors.birthday ||
        fieldErrors.gender
      ) {
        setStep(1);
      }

      return;
    }

    setErrors({});
    submitting.current = true;
    setPending(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const body: RegisterResult = await res.json();

      if (!body.success) {
        notifyError(body.error.message);
        return;
      }

      if (!res.ok) {
        notifyError("Không thể đăng ký, vui lòng thử lại.");
        return;
      }

      notifySuccess(body.message ?? "Đăng ký thành công!");

      router.replace("/login");
    } catch {
      notifyError("Không thể kết nối, vui lòng thử lại.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return {
    step,
    values,
    errors,
    pending,
    setFieldValue,
    validateField,
    nextStep,
    previousStep,
    handleSubmit,
  };
}
