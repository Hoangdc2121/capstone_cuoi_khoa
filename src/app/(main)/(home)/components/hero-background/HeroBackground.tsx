"use client";

import { useEffect, useRef } from "react";

type HeroBackgroundProps = {
  onReveal: () => void;
};

export default function HeroBackground({ onReveal }: HeroBackgroundProps) {
  const revealed = useRef(false);

  function revealContent() {
    if (revealed.current) return;

    revealed.current = true;
    onReveal();
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (revealed.current) return;

      revealed.current = true;
      onReveal();
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [onReveal]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-muted"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/hero_bg.mp4"
        tabIndex={-1}
        onTimeUpdate={(event) => {
          if (event.currentTarget.currentTime >= 3) {
            revealContent();
          }
        }}
        onLoadedMetadata={(event) => {
          // Video ngắn hơn 3 giây vẫn hiển thị được nội dung.
          const video = event.currentTarget;

          if (video.duration > 0 && video.duration <= 3) {
            revealContent();
          }
        }}
        onError={revealContent}
        className="absolute inset-0 block h-full w-full object-cover object-center"
      >
        <source
          src="/video/hero_bg.mp4"
          type="video/mp4"
          onError={revealContent}
        />
      </video>

      {/* Lớp phủ dùng màu foreground tối của light mode. */}
      <div aria-hidden="true" className="hero-background-overlay" />
    </div>
  );
}
