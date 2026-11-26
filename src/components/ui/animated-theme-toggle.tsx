"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { AnimatedThemeToggler } from "./animated-theme-toggler";

type AnimatedThemeToggleProps = {
  className?: string;
};

export const AnimatedThemeToggle = ({
  className,
}: AnimatedThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const buttonClassName = cn(
    buttonVariants({
      variant: "outline",
      size: "default",
    }),
    "px-2.5",
    className,
  );

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={buttonClassName}
        aria-label="Chuyển giao diện sáng/tối"
      >
        <span className="block size-5" />
      </button>
    );
  }

  return (
    <AnimatedThemeToggler
      theme={isDark ? "dark" : "light"}
      onThemeChange={setTheme}
      duration={500}
      variant="circle"
      className={buttonClassName}
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
    >
      <span className="relative block size-5" aria-hidden="true">
        <motion.span
          className="absolute inset-0"
          initial={false}
          animate={{
            rotate: isDark ? 90 : 0,
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.35 }}
        >
          <Sun className="size-5" />
        </motion.span>

        <motion.span
          className="absolute inset-0"
          initial={false}
          animate={{
            rotate: isDark ? 0 : -90,
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.35 }}
        >
          <Moon className="size-5" />
        </motion.span>
      </span>
    </AnimatedThemeToggler>
  );
};
