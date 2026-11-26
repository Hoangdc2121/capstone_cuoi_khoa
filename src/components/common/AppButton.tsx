"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "antd";

export default function AppButton({
  children,
  type = "primary",
  size = "large",
  htmlType = "button",
  loading = false,
  danger = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      type={type}
      size={size}
      htmlType={htmlType}
      loading={loading}
      danger={danger}
      className={cn(
        "app-button",
        type === "primary" && !danger && "app-button-shine",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
