"use client";

import FloatingInput from "@/components/common/FloatingInput";
import { useRegisterForm } from "../hooks/useRegisterForm";
import Link from "next/link";
import AppButton from "@/components/common/AppButton";
import AppDatePicker from "@/components/common/AppDatePicker";

export default function RegisterForm() {
  const {
    step,
    values,
    errors,
    pending,
    setFieldValue,
    validateField,
    previousStep,
    handleSubmit,
  } = useRegisterForm();

  return (
    <section className="w-full text-foreground!">
      {" "}
      <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-4xl">
        Bắt đầu hành trình.
      </h1>
      <p className="mt-2 text-sm leading-6 text-foreground/75">
        Tạo tài khoản, khám phá nơi bạn muốn đến.
      </p>
      <ol
        aria-label="Các bước đăng ký"
        className="mt-4 flex items-center gap-3 text-xs font-medium"
      >
        <li
          aria-current={step === 1 ? "step" : undefined}
          className={step === 1 ? "text-foreground" : "text-muted-foreground"}
        >
          01 thông tin
        </li>

        <li aria-hidden="true" className="h-px flex-1 bg-border" />

        <li
          aria-current={step === 2 ? "step" : undefined}
          className={step === 2 ? "text-foreground" : "text-muted-foreground"}
        >
          02 Mật khẩu
        </li>
      </ol>
      <form
        className="mt-4 space-y-5"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={pending}
      >
        {step === 1 ? (
          <div key="information" className="space-y-4">
            <FloatingInput
              id="register-name"
              name="name"
              label="Họ và tên"
              autoComplete="name"
              value={values.name}
              onChange={(event) => setFieldValue("name", event.target.value)}
              onBlur={() => validateField("name")}
              error={errors.name}
            />

            <FloatingInput
              id="register-email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => setFieldValue("email", event.target.value)}
              onBlur={() => validateField("email")}
              error={errors.email}
            />

            <FloatingInput
              id="register-phone"
              name="phone"
              label="Số điện thoại"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => setFieldValue("phone", event.target.value)}
              onBlur={() => validateField("phone")}
              error={errors.phone}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0">
                <AppDatePicker
                  label="Ngày sinh"
                  placeholder="Chọn ngày sinh"
                  value={values.birthday}
                  onChange={(value) => setFieldValue("birthday", value)}
                  error={errors.birthday}
                />

                {errors.birthday && (
                  <p
                    id="register-birthday-error"
                    role="alert"
                    className="mt-2 text-xs text-destructive"
                  >
                    {errors.birthday}
                  </p>
                )}
              </div>

              <fieldset
                className="min-w-0"
                aria-describedby={
                  errors.gender ? "register-gender-error" : undefined
                }
              >
                <legend className="mb-2 text-sm font-medium">Giới tính</legend>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Nam", value: true },
                    { label: "Nữ", value: false },
                  ].map((option) => (
                    <label
                      key={option.label}
                      className={`flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm transition-colors focus-within:ring-2 focus-within:ring-ring/40 ${
                        values.gender === option.value
                          ? "border-primary bg-primary/15 text-foreground"
                          : errors.gender
                            ? "border-destructive bg-card"
                            : "border-input bg-card hover:border-ring"
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={String(option.value)}
                        checked={values.gender === option.value}
                        onChange={() => setFieldValue("gender", option.value)}
                        aria-invalid={Boolean(errors.gender)}
                        className="size-4 accent-primary"
                      />

                      {option.label}
                    </label>
                  ))}
                </div>

                {errors.gender && (
                  <p
                    id="register-gender-error"
                    role="alert"
                    className="mt-2 text-xs text-destructive"
                  >
                    {errors.gender}
                  </p>
                )}
              </fieldset>
            </div>
          </div>
        ) : (
          <div key="security" className="space-y-4">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <p className="text-sm font-semibold text-foreground">
                Thông tin tài khoản
              </p>

              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-baseline gap-2">
                  <dt className="shrink-0 text-muted-foreground">Họ và tên:</dt>
                  <dd className="min-w-0 wrap-break-words font-medium text-foreground">
                    {values.name}
                  </dd>
                </div>

                <div className="flex items-baseline gap-2">
                  <dt className="shrink-0 text-muted-foreground">Email:</dt>
                  <dd className="min-w-0 break-all text-foreground">
                    {values.email}
                  </dd>
                </div>
              </dl>

              <AppButton
                type="link"
                htmlType="button"
                onClick={previousStep}
                disabled={pending}
                className="font-semibold text-secondary! no-underline! transition-colors duration-200 hover:text-primary! hover:no-underline!"
                style={{
                  paddingInline: 0,
                  height: 44,
                  fontSize: 14,
                }}
              >
                <span className="animated-underline">Chỉnh sửa thông tin</span>
              </AppButton>
            </div>

            <FloatingInput
              id="register-password"
              name="password"
              label="Mật khẩu"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) =>
                setFieldValue("password", event.target.value)
              }
              onBlur={() => validateField("password")}
              disabled={pending}
              error={errors.password}
            />

            <p className="text-xs leading-5 text-foreground/75">
              Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
            </p>

            <FloatingInput
              id="register-confirm-password"
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={(event) =>
                setFieldValue("confirmPassword", event.target.value)
              }
              onBlur={() => validateField("confirmPassword")}
              disabled={pending}
              error={errors.confirmPassword}
            />
          </div>
        )}

        {step === 1 ? (
          <AppButton
            key="continue"
            htmlType="submit"
            block
            style={{ height: 48, borderRadius: 999 }}
          >
            Tiếp tục
          </AppButton>
        ) : (
          <div className="flex gap-3">
            <AppButton
              key="create-account"
              htmlType="submit"
              loading={pending}
              block
              style={{
                height: 48,
                borderRadius: 999,
              }}
            >
              Tạo tài khoản
            </AppButton>
          </div>
        )}
      </form>
      <p className="mt-4 text-center text-sm text-foreground/80">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="animated-underline font-semibold text-secondary! transition-colors duration-200 hover:text-primary!"
        >
          Đăng nhập
        </Link>
      </p>
    </section>
  );
}
