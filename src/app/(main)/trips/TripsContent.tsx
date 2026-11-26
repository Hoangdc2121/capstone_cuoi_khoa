import Link from "next/link";

import type { BookingType } from "@/features/booking/types/booking.types";
import type { RoomType } from "@/features/rooms/types/room.types";

import TripsGrid from "./components/TripsGrid";
import TripsHero from "./components/TripsHero";
import Container from "@/components/common/Container";
import TripsFilters from "./components/TripsFilters";
import { Result } from "antd";
import { Luggage } from "lucide-react";

type TripTab = {
  id: string;
  label: string;
};

type TripsContentProps = {
  imageSrc: string;
  isSignedIn: boolean;
  hasLoadError: boolean;
  tabs: readonly TripTab[];
  activeTab: TripTab;
  bookings: readonly BookingType[];
  roomsById: ReadonlyMap<
    number,
    Pick<RoomType, "tenPhong" | "hinhAnh"> | null | undefined
  >;
};

export default function TripsContent({
  imageSrc,
  isSignedIn,
  hasLoadError,
  tabs,
  activeTab,
  bookings,
  roomsById,
}: TripsContentProps) {
  return (
    <main className="pb-16">
      <TripsHero imageSrc={imageSrc} />

      <Container className="py-10 lg:py-14">
        {!isSignedIn ? (
          <Result
            status="info"
            icon={
              <Luggage
                aria-hidden="true"
                className="mx-auto size-10 text-primary"
              />
            }
            title={
              <span className="font-heading text-2xl font-semibold text-foreground">
                Xem chuyến đi của bạn
              </span>
            }
            subTitle={
              <span className="font-sans text-sm text-muted-foreground">
                Đăng nhập để xem các chỗ ở bạn đã đặt.
              </span>
            }
          />
        ) : hasLoadError ? (
          <p role="alert" className="text-destructive">
            Chưa tải được danh sách chuyến đi. Vui lòng tải lại trang.
          </p>
        ) : (
          <>
            <div className="mb-6">
              <TripsFilters tabs={tabs} activeStatus={activeTab.id} />
            </div>

            <TripsGrid
              title={activeTab.label}
              bookings={bookings}
              roomsById={roomsById}
            />
          </>
        )}
      </Container>
    </main>
  );
}
