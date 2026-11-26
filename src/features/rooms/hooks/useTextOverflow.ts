"use client";

import { useEffect, useRef, useState } from "react";

export default function useTextOverflow(
  content: string | undefined,
  maxLines = 3,
) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    function measure() {
      if (!element) return;

      const lineHeight = Number.parseFloat(
        window.getComputedStyle(element).lineHeight,
      );

      if (!Number.isFinite(lineHeight)) return;

      setOverflowing(
        Boolean(content) &&
          element.scrollHeight > lineHeight * maxLines + 1,
      );
    }

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [content, maxLines]);

  return { ref, overflowing };
}