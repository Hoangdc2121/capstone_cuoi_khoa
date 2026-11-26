"use client";

import { useRef } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

import Reveal from "@/components/common/Reveal";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import type { RoomType } from "@/features/rooms/types/room.types";
import useScrollReveal from "@/hooks/useScrollReveal";

type ExploreRoomCardProps = {
  room: RoomType;
  locationLabel?: string;
};

export default function ExploreRoomCard({
  room,
  locationLabel,
}: ExploreRoomCardProps) {
  const { ref: cardRef, visible } = useScrollReveal();

  const image = room.hinhAnh?.trim();

  const roomDetails =
    `${room.khach} khách · ${room.phongNgu} phòng ngủ · ` +
    `${room.giuong} giường`;

  return (
    <div ref={cardRef} className="min-w-0">
      <Reveal
        animation="zoomIn"
        visible={visible}
        duration={0.6}
        from={{ opacity: 0, scale: 0.96 }}
        to={{ opacity: 1, scale: 1 }}
      >
        <article className="min-w-0">
          <Link
            href={`/rooms/${room.id}`}
            aria-label={`Xem chỗ ở ${room.tenPhong}`}
            className="group block rounded-2xl text-foreground! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {/* Ảnh phòng. */}
            <div className="aspect-4/3 overflow-hidden rounded-2xl bg-muted">
              {image ? (
                <img
                  src={image}
                  alt={room.tenPhong}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                  Chưa có hình ảnh
                </div>
              )}
            </div>

            {/* Giữ một dòng địa chỉ để các thẻ đều hàng. */}
            <div className="mt-3 flex min-h-5 min-w-0 items-center gap-1.5 sm:mt-4">
              {locationLabel && (
                <>
                  <MapPin
                    size={14}
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground"
                  />

                  <p
                    title={locationLabel}
                    className="m-0! min-w-0 truncate text-xs! leading-5! text-muted-foreground!"
                  >
                    {locationLabel}
                  </p>
                </>
              )}
            </div>

            {/* Hai dòng, mỗi dòng cao 24px trên grid nhiều cột. */}
            <h3
              title={room.tenPhong}
              className="mb-0! mt-1.5! line-clamp-2 font-heading text-base! font-semibold! leading-6! text-foreground! sm:mt-2! sm:h-12 sm:text-lg!"
            >
              {room.tenPhong}
            </h3>

            <p
              title={roomDetails}
              className="mb-0! mt-2! truncate text-sm! leading-6! text-muted-foreground!"
            >
              {roomDetails}
            </p>

            <p className="mb-0! mt-2! text-sm! leading-6! text-foreground! sm:mt-3!">
              <span className="text-base font-semibold">
                {room.giaTien} USD
              </span>
              <span className="text-muted-foreground"> / đêm</span>
            </p>
          </Link>
        </article>
      </Reveal>
    </div>
  );
}
