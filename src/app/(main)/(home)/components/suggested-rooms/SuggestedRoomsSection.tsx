"use client";

import { useRef } from "react";

import AppButton from "@/components/common/AppButton";
import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";

import useDestinations from "../../../../../features/destinations/hooks/useDestinations";

import SuggestedRoomsCarousel from "./components/SuggestedRoomsCarousel";
import useSuggestedRooms from "./hooks/useSuggestedRooms";
import useRooms from "@/features/rooms/hooks/useRooms";

export default function SuggestedRoomsSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  const reached = useIntersectionObserver(contentRef, {
    rootMargin: "0px 0px -120px 0px",
    threshold: 0,
    once: true,
  });

  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
    retry: retryRooms,
  } = useRooms(reached);

  const {
    destinations,
    loading: destinationsLoading,
    error: destinationsError,
    retry: retryDestinations,
  } = useDestinations(reached);

  const suggestedRooms = useSuggestedRooms(rooms);

  const loading = roomsLoading || destinationsLoading;
  const error = roomsError || destinationsError;
  const showContent = reached && !loading;

  function handleRetry() {
    if (roomsError) {
      retryRooms();
    }

    if (destinationsError) {
      retryDestinations();
    }
  }

  return (
    <section
      aria-labelledby="suggested-rooms-title"
      className="overflow-hidden bg-background text-foreground"
    >
      <Container spacing="section">
        <div ref={contentRef} className="min-h-96">
          {/* Giữ tên section cho trình đọc màn hình khi đang tải. */}
          {loading && (
            <h2 id="suggested-rooms-title" className="sr-only">
              Gợi ý chỗ ở cho chuyến đi
            </h2>
          )}

          {loading ? (
            <div
              role="status"
              aria-label="Đang tải gợi ý chỗ ở"
              aria-busy="true"
            >
              {/* Skeleton tiêu đề. */}
              <div className="ml-auto max-w-lg space-y-3">
                <div className="ml-auto h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
                <div className="ml-auto h-10 w-full animate-pulse rounded-lg bg-muted" />
                <div className="ml-auto h-4 w-5/6 animate-pulse rounded bg-muted" />
              </div>

              <div className="mt-6 h-16 border-b border-border" />

              {/* Skeleton ba card. */}
              <div
                aria-hidden="true"
                className="mt-7 grid grid-cols-1 gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-3"
              >
                {Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className={`aspect-7/8 animate-pulse rounded-2xl bg-muted ${
                      index === 1
                        ? "hidden sm:block lg:translate-y-6"
                        : index === 2
                          ? "hidden lg:block lg:translate-y-12"
                          : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="max-w-xl text-left">
                <h2
                  id="suggested-rooms-title"
                  className="m-0! text-3xl! font-semibold! tracking-tight lg:text-4xl!"
                >
                  <span className="block overflow-hidden py-1">
                    <Reveal as="span" animation="up" visible={showContent}>
                      Chọn một chỗ ở.
                    </Reveal>
                  </span>

                  <span className="block overflow-hidden py-1">
                    <Reveal
                      as="span"
                      animation="up"
                      visible={showContent}
                      delay={0.2}
                      className="text-secondary"
                    >
                      Mở một chuyến đi.
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
                    Những gợi ý từ nhiều khu vực, cho một hành trình theo cách
                    của bạn.
                  </p>
                </Reveal>
              </div>

              <Reveal
                animation="up"
                visible={showContent}
                delay={0.35}
                duration={0.7}
              >
                {error ? (
                  <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                    <p role="alert" className="m-0! text-sm! text-destructive">
                      {error}
                    </p>

                    <AppButton
                      type="default"
                      htmlType="button"
                      onClick={handleRetry}
                      className="mt-4 border-border! bg-card! text-card-foreground!"
                    >
                      Thử lại
                    </AppButton>
                  </div>
                ) : suggestedRooms.length === 0 ? (
                  <p className="mt-8 text-sm text-muted-foreground">
                    Chưa có chỗ ở để gợi ý.
                  </p>
                ) : (
                  <SuggestedRoomsCarousel
                    rooms={suggestedRooms}
                    destinations={destinations}
                  />
                )}
              </Reveal>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
