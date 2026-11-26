import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { RoomType } from "@/features/rooms/types/room.types";

type RoomCardProps = {
  room: RoomType;
  locationLabel: string;
};

export default function RoomCard({ room, locationLabel }: RoomCardProps) {
  return (
    <article className="h-full">
      <Link
        href={`/phong/${room.id}`}
        aria-label={`Xem phòng ${room.tenPhong} tại ${locationLabel}`}
        className="group relative isolate block aspect-7/8 overflow-hidden rounded-2xl border border-border bg-muted text-primary-foreground! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <img
          src={room.hinhAnh}
          alt={room.tenPhong}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        />

        {/* Tập trung lớp phủ ở vùng chữ, giữ phần trên ảnh rõ. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/95 via-black/45 to-transparent"
        />

        {/* Giá phòng. */}
        <span className="absolute left-3 top-3 rounded-full border border-border bg-card/95 px-3 py-1.5 text-xs font-semibold text-card-foreground! backdrop-blur-sm sm:left-4 sm:top-4">
          {room.giaTien} USD
          <span className="font-normal"> / đêm</span>
        </span>

        {/* Thông tin phòng. */}
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 p-4 sm:gap-3 sm:p-5">
          <div className="min-w-0 flex-1">
            <p className="m-0! truncate text-[10px]! font-medium! uppercase leading-5! tracking-wide text-primary-foreground/80! sm:text-[11px]!">
              {locationLabel}
            </p>

            <h3 className="mb-0! mt-1.5! line-clamp-2 min-h-12 font-heading text-base! font-semibold! leading-6! text-primary-foreground! sm:mt-2! sm:min-h-14 sm:text-xl! sm:leading-7!">
              {room.tenPhong}
            </h3>
          </div>

          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/15 text-primary-foreground! backdrop-blur-sm transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-focus-visible:border-primary group-focus-visible:bg-primary group-active:border-primary-active group-active:bg-primary-active sm:size-10"
          >
            <ArrowUpRight size={19} />
          </span>
        </div>
      </Link>
    </article>
  );
}
