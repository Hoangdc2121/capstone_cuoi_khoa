"use client";

import { useRef, type ComponentProps } from "react";
import { MapPin } from "lucide-react";

import AppButton from "@/components/common/AppButton";
import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

import DestinationSelector from "./DestinationSelector";

type ExploreHeroProps = {
  title: string;
  image: string;
  selectedDestination?: {
    tenViTri: string;
    tinhThanh: string;
  };
  options: ComponentProps<typeof DestinationSelector>["options"];
  destinationId?: number;
  invalidDestinationId: boolean;
  destinationsLoading: boolean;
  destinationsError: string | null;
  description: string;
  onRetryDestinations: () => void;
  onSelectDestination: (id?: number) => void;
};

export default function ExploreHero({
  title,
  image,
  description,
  selectedDestination,
  options,
  destinationId,
  invalidDestinationId,
  destinationsLoading,
  destinationsError,
  onRetryDestinations,
  onSelectDestination,
}: ExploreHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  const showContent = useIntersectionObserver(heroRef, {
    threshold: 0,
    once: true,
  });

  return (
    <section
      ref={heroRef}
      aria-labelledby="explore-title"
      className="relative isolate overflow-hidden"
    >
      {/* Ảnh nền và lớp phủ. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-2xl lg:rounded-none"
      >
        <img
          src={image}
          alt=""
          decoding="async"
          draggable={false}
          className="h-full w-full select-none object-cover object-center"
        />

        <div className="hero-background-overlay" />
      </div>

      <Container className="relative z-10">
        <div className="grid gap-3 pb-8 pt-24 sm:gap-5 sm:pb-10 sm:pt-28 lg:min-h-[600px] lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center lg:gap-16 lg:pb-16 lg:pt-36">
          {/* Giới thiệu. */}
          <div className="min-w-0">
            <Reveal animation="up" visible={showContent} duration={0.7}>
              <p className="m-0! text-xs! font-medium! leading-5! tracking-[0.14em] text-primary-foreground/85! sm:text-sm!">
                CHỌN NƠI BẠN MUỐN ĐẾN
              </p>
            </Reveal>

            <h1
              id="explore-title"
              className="mb-0! mt-3! max-w-3xl font-heading text-3xl! font-semibold! leading-tight! tracking-tight text-primary-foreground! drop-shadow-sm sm:mt-4! sm:text-5xl! lg:text-6xl!"
            >
              <span className="block overflow-hidden py-1 lg:py-2">
                <Reveal
                  as="span"
                  animation="up"
                  visible={showContent}
                  delay={0.15}
                  duration={0.7}
                >
                  <span className="relative inline-block pb-5 text-secondary">
                    {title}

                    <svg
                      aria-hidden="true"
                      viewBox="0 0 240 24"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute bottom-0 left-0 h-5 w-full text-primary"
                      fill="none"
                    >
                      <path
                        d="M4 17 Q60 3 120 13 T236 9"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="4 5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </span>
                </Reveal>
              </span>
            </h1>

            <Reveal
              animation="up"
              visible={showContent}
              delay={0.3}
              duration={0.7}
              className="mt-3 max-w-lg sm:mt-4"
            >
              {selectedDestination && (
                <p className="mb-2! mt-0! flex items-start gap-1.5 text-sm! leading-6! text-primary-foreground/90! sm:mb-3!">
                  <MapPin
                    size={17}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {selectedDestination.tenViTri},{" "}
                    {selectedDestination.tinhThanh}
                  </span>
                </p>
              )}

              <p className="m-0! text-pretty text-sm! leading-6! text-primary-foreground/90! sm:text-base! sm:leading-7!">
                {description}
              </p>
            </Reveal>

            {invalidDestinationId && (
              <div className="mt-5 rounded-2xl border border-border bg-card p-4">
                <p role="alert" className="m-0! text-sm! text-destructive!">
                  Mã khu vực trên đường dẫn không hợp lệ.
                </p>

                <AppButton
                  htmlType="button"
                  onClick={() => onSelectDestination()}
                  className="mt-3"
                >
                  Xem tất cả khu vực
                </AppButton>
              </div>
            )}
          </div>

          {/* Chọn khu vực. */}
          <Reveal
            animation="up"
            visible={showContent}
            delay={0.45}
            duration={0.7}
            className="min-w-0"
          >
            <DestinationSelector
              options={options}
              destinationId={destinationId}
              invalidDestinationId={invalidDestinationId}
              loading={destinationsLoading}
              error={destinationsError}
              onRetry={onRetryDestinations}
              onSelect={onSelectDestination}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
