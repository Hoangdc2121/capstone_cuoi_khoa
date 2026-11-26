"use client";

import AppButton from "@/components/common/AppButton";
import { useLoginForm } from "../hooks/useLoginForm";
import Link from "next/link";
import FloatingInput from "@/components/common/FloatingInput";

export default function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    pending,
    handleSubmit,
    validateField,
  } = useLoginForm();
  return (
    <section>
      <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-4xl">
        Đi đâu tiếp?
      </h1>

      <p className="mt-3 text-sm leading-6 text-foreground/75">
        Đăng nhập để tiếp tục hành trình của bạn.
      </p>

      <form
        className="mt-4 space-y-5"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={pending}
      >
        <div className="space-y-5">
          <FloatingInput
            id="login-email"
            name="email"
            label="Địa chỉ Email "
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            disabled={pending}
            error={errors.email}
            onBlur={(event) => validateField("email", event.target.value)}
          />

          <FloatingInput
            id="login-password"
            name="password"
            label="Mật khẩu"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
            }}
            disabled={pending}
            error={errors.password}
            // Trong FloatingInput mật khẩu:
            onBlur={(event) => validateField("password", event.target.value)}
          />
        </div>

        <AppButton
          htmlType="submit"
          loading={pending}
          block
          style={{
            height: 48,
            borderRadius: 999,
          }}
        >
          Đăng nhập
        </AppButton>
      </form>

      <p className="mt-4 text-center text-sm text-foreground/80">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="animated-underline font-semibold text-secondary! transition-colors duration-200 hover:text-primary!"
        >
          Đăng ký ngay
        </Link>
      </p>
    </section>
  );
}
