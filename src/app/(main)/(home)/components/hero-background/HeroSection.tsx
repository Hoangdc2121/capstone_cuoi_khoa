"use client";

import { useCallback, useState, type ReactNode } from "react";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import HeroBackground from "./HeroBackground";

type HeroSectionProps = {
  children?: ReactNode;
};

export default function HeroSection({ children }: HeroSectionProps) {
  const [showContent, setShowContent] = useState(false);

  const revealContent = useCallback(() => {
    setShowContent(true);
  }, []);

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate bg-background lg:flex lg:min-h-svh lg:flex-col lg:justify-center"
    >
      {/* Mobile: video nằm sau phần giới thiệu và đầu form tìm kiếm. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-105 overflow-hidden rounded-b-2xl sm:h-115 lg:inset-0 lg:h-auto lg:rounded-none">
        <HeroBackground onReveal={revealContent} />
      </div>

      <Container className="relative z-10 pb-8 pt-28 sm:pb-10 sm:pt-32 lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:pb-44 lg:pt-40">
        {/* Nội dung giới thiệu. */}
        <div className="w-full text-left lg:max-w-4xl lg:text-center">
          <h1
            id="home-hero-title"
            className="m-0! font-heading text-[clamp(2rem,8.5vw,3rem)]! font-semibold! leading-[1.15]! tracking-tight text-primary-foreground! drop-shadow-sm lg:text-8xl!"
          >
            <span className="block overflow-hidden py-1 lg:py-2">
              <Reveal
                as="span"
                animation="up"
                visible={showContent}
                duration={0.7}
              >
                Đi đâu cũng được.
              </Reveal>
            </span>

            <span className="block overflow-hidden py-1 lg:py-2">
              <Reveal
                as="span"
                animation="up"
                visible={showContent}
                delay={0.15}
                duration={0.7}
                className="text-secondary"
              >
                Miễn là được đi.
              </Reveal>
            </span>
          </h1>

          <Reveal
            animation="up"
            visible={showContent}
            delay={0.3}
            duration={0.7}
            className="mt-4 max-w-sm sm:max-w-lg lg:mx-auto lg:max-w-2xl"
          >
            <p className="m-0! text-pretty text-sm! leading-6! text-primary-foreground/90! sm:text-base! sm:leading-7! lg:text-lg!">
              Khám phá điểm đến mới, tìm chỗ nghỉ hợp ý và bắt đầu chuyến đi của
              bạn.
            </p>
          </Reveal>
        </div>

        {/* Tìm kiếm. */}
        {children && (
          <Reveal
            animation="up"
            visible={showContent}
            delay={0.45}
            duration={0.7}
            className="mt-6 w-full sm:mt-8 lg:mt-12 lg:max-w-5xl"
          >
            <div id="home-search" className="scroll-mt-28">
              {children}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
