"use client";

import type { ReactNode } from "react";
import {
  motion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";

type AnimationPreset = {
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
};

const presets = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },

  up: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },

  down: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },

  left: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },

  right: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },

  upLeft: {
    hidden: { opacity: 0, x: 30, y: 30 },
    visible: { opacity: 1, x: 0, y: 0 },
  },

  upRight: {
    hidden: { opacity: 0, x: -30, y: 30 },
    visible: { opacity: 1, x: 0, y: 0 },
  },

  downLeft: {
    hidden: { opacity: 0, x: 30, y: -30 },
    visible: { opacity: 1, x: 0, y: 0 },
  },

  downRight: {
    hidden: { opacity: 0, x: -30, y: -30 },
    visible: { opacity: 1, x: 0, y: 0 },
  },

  zoomIn: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },

  zoomOut: {
    hidden: { opacity: 0, scale: 1.15 },
    visible: { opacity: 1, scale: 1 },
  },

  blur: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },

  blurUp: {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },

  rotateLeft: {
    hidden: { opacity: 0, rotate: 10, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },

  rotateRight: {
    hidden: { opacity: 0, rotate: -10, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },

  flipX: {
    hidden: { opacity: 0, rotateX: 80 },
    visible: { opacity: 1, rotateX: 0 },
  },

  flipY: {
    hidden: { opacity: 0, rotateY: 80 },
    visible: { opacity: 1, rotateY: 0 },
  },

  revealUp: {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    visible: { clipPath: "inset(0% 0% 0% 0%)" },
  },

  revealDown: {
    hidden: { clipPath: "inset(0% 0% 100% 0%)" },
    visible: { clipPath: "inset(0% 0% 0% 0%)" },
  },

  revealLeft: {
    hidden: { clipPath: "inset(0% 0% 0% 100%)" },
    visible: { clipPath: "inset(0% 0% 0% 0%)" },
  },

  revealRight: {
    hidden: { clipPath: "inset(0% 100% 0% 0%)" },
    visible: { clipPath: "inset(0% 0% 0% 0%)" },
  },

  none: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
} satisfies Record<string, AnimationPreset>;

type AnimationName = keyof typeof presets;

type RevealProps = {
  children: ReactNode;
  animation?: AnimationName;
  visible?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "span";

  // Truyền hiệu ứng riêng khi các preset chưa đủ.
  from?: TargetAndTransition;
  to?: TargetAndTransition;
  transition?: Transition;
};

export default function Reveal({
  children,
  animation = "up",
  visible = true,
  delay = 0,
  duration = 1.4,
  className,
  as = "div",
  from,
  to,
  transition,
}: RevealProps) {
  const Element = as === "span" ? motion.span : motion.div;
  const preset = presets[animation];

  return (
    <Element
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={{
        hidden: from ?? preset.hidden,
        visible: to ?? preset.visible,
      }}
      transition={
        animation === "none"
          ? { duration: 0, delay }
          : {
              duration,
              delay,
              ease: "easeOut",
              ...transition,
            }
      }
      style={{
        visibility: visible ? "visible" : "hidden",
        transformPerspective: 1000,
      }}
      className={`block ${className ?? ""}`}
    >
      {children}
    </Element>
  );
}
