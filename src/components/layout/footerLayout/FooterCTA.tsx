"use client";

import { useRef } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import useScrollReveal from "@/hooks/useScrollReveal";

export default function FooterCTA() {
  const { ref: contentRef, visible } = useScrollReveal({
    threshold: 0,
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <section
      aria-labelledby="footer-cta-title"
      className="relative isolate overflow-hidden bg-background"
    >
      {/* Ảnh nền và lớp phủ nối với nền trang. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img
          src="/img/bg_footer.jpg"
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full select-none object-cover object-center"
        />

        <div className="hero-background-overlay" />
      </div>

      <Container className="relative z-10">
        <div className="flex min-h-[400px] items-center justify-center pb-24 pt-12 sm:min-h-[480px] sm:pb-28 sm:pt-16 lg:min-h-[560px] lg:pb-32 lg:pt-20">
          <div
            ref={contentRef}
            className="flex w-full min-w-0 flex-col items-center text-center"
          >
            <Reveal animation="fade" visible={visible} duration={0.7}>
              <p className="m-0! text-xs! font-medium! leading-5! tracking-[0.16em] text-primary-foreground/85! sm:text-sm!">
                ĐI VÀ TRẢI NGHIỆM
              </p>
            </Reveal>

            <h2
              id="footer-cta-title"
              className="mb-0! mt-3! max-w-4xl font-heading text-2xl! font-semibold! leading-tight! tracking-tight text-primary-foreground! sm:mt-4! sm:text-4xl! lg:text-5xl!"
            >
              <span className="block overflow-hidden py-1">
                <Reveal
                  as="span"
                  animation="up"
                  visible={visible}
                  delay={0.1}
                  duration={0.7}
                >
                  Khám phá nơi bạn thích,
                </Reveal>
              </span>

              <span className="block overflow-hidden py-1 text-secondary">
                <Reveal
                  as="span"
                  animation="up"
                  visible={visible}
                  delay={0.25}
                  duration={0.7}
                >
                  tìm một chỗ ở thật hợp.
                </Reveal>
              </span>
            </h2>

            <Reveal
              animation="up"
              visible={visible}
              delay={0.4}
              duration={0.7}
              className="mt-3 max-w-xs sm:mt-4 sm:max-w-lg"
            >
              <p className="m-0! text-pretty text-sm! leading-6! text-primary-foreground/90! sm:text-base! sm:leading-7!">
                Bắt đầu lên kế hoạch cho chuyến đi tiếp theo của bạn.
              </p>
            </Reveal>

            <Reveal
              animation="up"
              visible={visible}
              delay={0.55}
              duration={0.7}
              className="mt-5 sm:mt-6"
            >
              <Link
                href="/#home-search"
                className="group inline-flex! min-h-12 items-center gap-4 rounded-full border border-border bg-card py-1.5 pl-5 pr-1.5 text-sm! font-medium! text-card-foreground! shadow-sm transition-shadow duration-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:min-h-14 sm:gap-5 sm:py-2 sm:pl-6 sm:pr-2 sm:text-base!"
              >
                Tìm chỗ ở
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors duration-200 group-hover:bg-primary-hover group-focus-visible:bg-primary-hover group-active:bg-primary-active sm:size-10"
                >
                  <Plus
                    size={19}
                    className="transition-transform duration-300 group-hover:rotate-90 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
