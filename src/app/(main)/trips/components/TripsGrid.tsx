import Link from "next/link";

import type { BookingType } from "@/features/booking/types/booking.types";
import type { RoomType } from "@/features/rooms/types/room.types";

import TripCard from "./TripCard";
import { ArrowRight } from "lucide-react";
import AppButton from "@/components/common/AppButton";

type TripRoom = Pick<RoomType, "tenPhong" | "hinhAnh">;

type TripsGridProps = {
  title: string;
  bookings: readonly BookingType[];
  roomsById: ReadonlyMap<number, TripRoom | null | undefined>;
};

export default function TripsGrid({
  title,
  bookings,
  roomsById,
}: TripsGridProps) {
  return (
    <section
      id="trips-results"
      aria-label={`Chuyến đi ${title.toLocaleLowerCase("vi-VN")}`}
      className="scroll-mt-24"
    >
      <p className="m-0! text-sm! text-muted-foreground!">
        {bookings.length} chuyến đi
      </p>

      {bookings.length === 0 ? (
        <div className="mt-4 flex flex-col items-center text-center">
          <p className="m-0! text-sm! leading-6! text-muted-foreground!">
            Bạn chưa có chuyến đi trong mục này.
          </p>

          <AppButton href="/explore" className="mt-4">
            Khám phá chỗ ở
            <ArrowRight size={16} aria-hidden="true" />
          </AppButton>
        </div>
      ) : (
        <ul className="m-0 mt-4 grid list-none gap-x-6 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <TripCard
              key={booking.id}
              booking={booking}
              room={roomsById.get(booking.maPhong)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
