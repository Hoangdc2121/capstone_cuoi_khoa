"use client";

import { useRef } from "react";

import AppButton from "@/components/common/AppButton";
import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

import useDestinations from "../../../../../../features/destinations/hooks/useDestinations";
import DestinationGrid from "./components/DestinationGrid";

export default function DestinationSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  // Cuộn tới vùng lưới thì kích hoạt tải dữ liệu.
  const reached = useIntersectionObserver(gridRef, {
    threshold: 0.15,
    once: true,
  });

  const { destinations, loading, error, retry } = useDestinations(reached);

  const showContent = reached && !loading;

  return (
    <section
      aria-labelledby="destination-section-title"
      className="overflow-hidden bg-background text-foreground"
    >
      <Container spacing="section">
        <div>
          <h2
            id="destination-section-title"
            className="m-0! max-w-xl text-3xl! font-semibold! tracking-tight lg:text-4xl!"
          >
            <span className="block overflow-hidden py-1">
              <Reveal as="span" animation="up" visible={showContent}>
                Chuyến đi tiếp theo, ở đâu?
              </Reveal>
            </span>
          </h2>

          <Reveal
            animation="up"
            visible={showContent}
            delay={0.5}
            className="mt-3"
          >
            <p className="m-0! text-sm! leading-6! text-muted-foreground sm:text-base!">
              Tìm một nơi mới, chọn một chỗ ở hợp gu.
            </p>
          </Reveal>
        </div>

        <div ref={gridRef} className="mt-6 min-h-96 lg:mt-10">
          {loading ? (
            <div
              role="status"
              aria-label="Đang tải địa điểm"
              aria-busy="true"
              className="grid uto-rows-45 grid-cols-2 gap-3 sm:auto-rows-52.5 lg:auto-rows-55 lg:grid-cols-3 lg:gap-4"
            >
              {Array.from({ length: 10 }, (_, index) => {
                const layouts = [
                  "col-span-2",
                  "lg:row-span-2",
                  "",
                  "",
                  "lg:row-span-2",
                  "lg:col-span-2",
                  "",
                  "",
                ];

                return (
                  <div
                    key={index}
                    aria-hidden="true"
                    className={`animate-pulse rounded-2xl bg-muted ${layouts[index]}`}
                  />
                );
              })}
            </div>
          ) : (
            <Reveal animation="up" visible={showContent} delay={0.8}>
              {error ? (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <p role="alert" className="m-0! text-sm text-destructive">
                    {error}
                  </p>

                  <AppButton
                    type="default"
                    htmlType="button"
                    onClick={retry}
                    className="mt-3 text-primary!"
                  >
                    Thử lại
                  </AppButton>
                </div>
              ) : destinations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chưa có địa điểm để hiển thị.
                </p>
              ) : (
                <DestinationGrid destinations={destinations} />
              )}
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
