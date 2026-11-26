import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  spacing?: "none" | "section";
};

export default function Container({
  children,
  className,
  spacing = "none",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8",
        spacing === "section" && "pt-12 lg:pt-16",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
