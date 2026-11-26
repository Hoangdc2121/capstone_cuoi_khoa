"use client";

import { Map } from "lucide-react";

import AppButton from "@/components/common/AppButton";
import Container from "@/components/common/Container";
import type { RoomType } from "@/features/rooms/types/room.types";
import type { DestinationType } from "@/features/destinations/types/destination.types";
import ExploreRoomCard from "./ExploreRoomCard";

type ExploreRoomGridProps = {
  rooms: RoomType[];
  destinations: DestinationType[];
  title: string;
  loading: boolean;
  error: string | null;
  invalidDestinationId: boolean;
  destinationId?: number;
  onRetry: () => void;
  onShowAll: () => void;
  onViewMap: () => void;
};

export default function ExploreRoomGrid({
  rooms,
  destinations,
  title,
  loading,
  error,
  invalidDestinationId,
  destinationId,
  onRetry,
  onShowAll,
  onViewMap,
}: ExploreRoomGridProps) {
  return (
    <Container>
      <section
        id="explore-results"
        aria-labelledby="explore-results-title"
        aria-busy={loading}
        className="scroll-mt-24 py-10 lg:py-14"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2
              id="explore-results-title"
              className="m-0! font-heading text-2xl! font-semibold! leading-tight! text-foreground! sm:text-3xl!"
            >
              {title}
            </h2>

            {!invalidDestinationId && !loading && !error && (
              <p className="mb-0! mt-2! text-sm! text-muted-foreground!">
                {rooms.length} chỗ ở
              </p>
            )}
          </div>

          {!invalidDestinationId && (
            <AppButton
              type="default"
              htmlType="button"
              onClick={onViewMap}
              className="inline-flex! h-11! shrink-0! items-center! justify-center! gap-2! self-start! rounded-xl! border-primary! bg-transparent! px-4! text-primary! transition-colors! duration-300! ease-out! hover:border-primary! hover:bg-primary/10! hover:text-primary! sm:self-auto!"
            >
              <Map size={20} aria-hidden="true" />
              <span>Xem bản đồ</span>
            </AppButton>
          )}
        </div>

        {invalidDestinationId ? (
          <p className="mb-0! mt-5! text-sm! text-muted-foreground!">
            Chọn một khu vực hợp lệ để xem danh sách phòng.
          </p>
        ) : loading ? (
          <div role="status" className="mt-6">
            <p className="m-0! text-sm! text-muted-foreground!">
              Đang tải danh sách phòng…
            </p>

            <div
              aria-hidden="true"
              className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="animate-pulse motion-reduce:animate-none"
                >
                  <div className="aspect-4/3 rounded-2xl bg-muted" />
                  <div className="mt-4 h-5 w-3/4 rounded bg-muted" />
                  <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <p role="alert" className="m-0! text-sm! text-destructive!">
              {error}
            </p>

            <AppButton htmlType="button" onClick={onRetry} className="mt-4">
              Thử lại
            </AppButton>
          </div>
        ) : rooms.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <p className="m-0! text-sm! leading-6! text-muted-foreground!">
              Không tìm thấy chỗ ở phù hợp với điều kiện hiện tại. Bạn thử đổi
              khu vực hoặc số khách nhé.
            </p>

            {destinationId !== undefined && (
              <AppButton htmlType="button" onClick={onShowAll} className="mt-4">
                Xem tất cả chỗ ở
              </AppButton>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => {
              const location = destinations.find(
                (destination) => destination.id === room.maViTri,
              );

              return (
                <ExploreRoomCard
                  key={room.id}
                  room={room}
                  locationLabel={
                    location
                      ? `${location.tenViTri}, ${location.tinhThanh}`
                      : undefined
                  }
                />
              );
            })}
          </div>
        )}
      </section>
    </Container>
  );
}
