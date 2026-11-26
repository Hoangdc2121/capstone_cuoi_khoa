"use client";

import { useRef } from "react";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";

type ScrollRevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

export default function useScrollReveal<
  T extends HTMLElement = HTMLDivElement,
>({
  threshold = 0.1,
  rootMargin = "0px 0px -24px 0px",
  once = true,
}: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null);

  const visible = useIntersectionObserver(ref, {
    threshold,
    rootMargin,
    once,
  });

  return { ref, visible };
}