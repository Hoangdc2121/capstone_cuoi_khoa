"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
};

export default function useIntersectionObserver<T extends Element>(
  targetRef: RefObject<T | null>,
  {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    once = false,
  }: Options = {},
) {
  const [inView, setInView] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const target = targetRef.current;

    if (!target || (once && triggeredRef.current)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        const visible =
          entry.isIntersecting &&
          entry.intersectionRatio >= threshold;

        setInView(visible);

        if (visible && once) {
          triggeredRef.current = true;
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [targetRef, root, rootMargin, threshold, once]);

  return inView;
}