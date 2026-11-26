"use client";

import Link from "next/link";

import Reveal from "@/components/common/Reveal";
import type { BookingType } from "@/features/booking/types/booking.types";
import type { RoomType } from "@/features/rooms/types/room.types";
import useScrollReveal from "@/hooks/useScrollReveal";

import { formatTripDate } from "../utils/formatTripDate";

type TripCardProps = {
  booking: BookingType;
  room?: Pick<RoomType, "tenPhong" | "hinhAnh"> | null;
};

export default function TripCard({ booking, room }: TripCardProps) {
  const { ref: cardRef, visible } = useScrollReveal<HTMLLIElement>();

  const roomName = room?.tenPhong?.trim() || `Phòng #${booking.maPhong}`;
  const image = room?.hinhAnh?.trim();

  return (
    <li ref={cardRef} className="min-w-0">
      <Reveal
        animation="zoomIn"
        visible={visible}
        duration={0.6}
        from={{ opacity: 0, scale: 0.96 }}
        to={{ opacity: 1, scale: 1 }}
      >
        <article className="min-w-0">
          <Link
            href={`/rooms/${booking.maPhong}`}
            aria-label={`Xem chỗ ở ${roomName}, đơn ${booking.id}`}
            className="group block rounded-2xl text-foreground! no-underline! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <div className="aspect-video overflow-hidden rounded-2xl bg-muted sm:aspect-4/3">
              {image ? (
                <img
                  src={image}
                  alt=""
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

            <p className="mb-0! mt-3! text-xs! leading-5! text-muted-foreground! sm:mt-4!">
              Đơn #{booking.id} · {booking.soLuongKhach} khách
            </p>

            <h3
              title={roomName}
              className="mb-0! mt-1.5! line-clamp-2 font-heading text-base! font-semibold! leading-6! text-foreground! sm:mt-2! sm:h-12 sm:text-lg!"
            >
              {roomName}
            </h3>

            <dl className="m-0 mt-3 grid grid-cols-2 gap-3 rounded-xl bg-muted px-3 py-2.5">
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">Nhận phòng</dt>
                <dd className="m-0 mt-1 text-sm font-semibold text-foreground">
                  {formatTripDate(booking.ngayDen)}
                </dd>
              </div>

              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">Trả phòng</dt>
                <dd className="m-0 mt-1 text-sm font-semibold text-foreground">
                  {formatTripDate(booking.ngayDi)}
                </dd>
              </div>
            </dl>
          </Link>
        </article>
      </Reveal>
    </li>
  );
}
