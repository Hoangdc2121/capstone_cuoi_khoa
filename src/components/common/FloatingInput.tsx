"use client";

import { useState } from "react";
import { Input, type InputProps } from "antd";
import { cn } from "@/lib/utils";

type FloatingInputProps = {
  id: string;
  name?: string;
  label: string;
  type?: InputProps["type"];
  value?: string;
  onChange?: InputProps["onChange"];
  onBlur?: InputProps["onBlur"];
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
};

export default function FloatingInput({
  id,
  name,
  label,
  type = "text",
  value = "",
  onChange,
  onBlur,
  autoComplete,
  disabled = false,
  error,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password";
  const labelRaised = focused || value.length > 0;
  const InputComponent = isPassword ? Input.Password : Input;

  return (
    <div>
      <div className="relative">
        <InputComponent
          id={id}
          name={name}
          {...(!isPassword && { type })}
          autoComplete={autoComplete}
          placeholder=" "
          value={value}
          disabled={disabled}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          status={error ? "error" : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "auth-floating-input h-16! w-full! min-w-0 rounded-xl! text-base!",
            isPassword
              ? "[&_input]:min-w-0 [&_input]:pb-2! [&_input]:pt-7! [&_input]:text-base!"
              : "pb-2! pt-7!",
          )}
          style={{
            paddingInline: 16,
            fontSize: 16,
            backgroundColor: "var(--card)",
            color: "var(--foreground)",
          }}
        />

        <label
          htmlFor={id}
          className={cn(
            "absolute left-4 top-1/2 z-10 origin-left text-sm leading-5",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-text",
            error
              ? "text-destructive"
              : focused
                ? "text-primary"
                : "text-muted-foreground",
          )}
          style={{
            transform: labelRaised
              ? "translateY(-24px) scale(0.85)"
              : "translateY(-50%) scale(1)",
            transition:
              "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), color 200ms ease",
          }}
        >
          {label}
        </label>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
