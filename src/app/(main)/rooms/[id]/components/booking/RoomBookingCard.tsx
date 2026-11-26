"use client";

import { Select } from "antd";
import { ChevronDown, Star } from "lucide-react";
import { useId, useState, type Ref } from "react";

import AppButton from "@/components/common/AppButton";
import AppDatePicker, {
  type DateRangeValue,
} from "@/components/common/AppDatePicker";
import getRoomBookingPrice, {
  formatPrice,
} from "@/features/rooms/hooks/getRoomBookingPrice";

import RoomBookingPriceBreakdown from "./RoomBookingPriceBreakdown";
import useRoomBooking from "@/features/booking/hooks/useRoomBooking";
import RoomBookingConfirmModal from "./RoomBookingConfirmModal";
import useRoomAvailability from "@/features/booking/hooks/useRoomAvailability";

type RoomBookingCardProps = {
  roomId: number;
  roomName: string;
  price: number;
  maxGuests: number;
  reviewStats?: {
    averageRating: number;
    ratingCount: number;
    reviewCount: number;
  };
  datePickerRef?: Ref<HTMLDivElement>;
};

export default function RoomBookingCard({
  roomId,
  roomName,
  price,
  maxGuests,
  reviewStats,
  datePickerRef,
}: RoomBookingCardProps) {
  const id = useId();
  const guestsId = `${id}-guests`;

  const [dates, setDates] = useState<DateRangeValue>({
    checkIn: "",
    checkOut: "",
  });
  const [guests, setGuests] = useState("1");

  const pricing = getRoomBookingPrice(price, dates);
  const { nights, total } = pricing;
  const hasDates = nights > 0;

  const {
    confirmOpen,
    submitting,
    bookingError,
    guestCount,
    canBook,
    openConfirmation,
    closeConfirmation,
    handleConfirmBooking,
  } = useRoomBooking({ roomId, maxGuests, dates, guests, hasDates });

  const { bookedRanges, availabilityError } = useRoomAvailability(roomId);

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="rounded-2xl border border-border bg-card text-card-foreground shadow-xl shadow-foreground/5"
    >
      <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2">
        <div className="min-w-0 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="m-0! text-xs! text-muted-foreground!">
              <span className="font-heading text-2xl font-semibold text-card-foreground">
                {formatPrice(price)}
              </span>
              <span className="ml-1 font-medium text-card-foreground">USD</span>
              {" / đêm"}
            </p>

            <span className="hidden shrink-0 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground sm:inline-flex">
              Theo đêm
            </span>
          </div>

          {reviewStats && (
            <p className="mb-0! mt-2! hidden items-start gap-1.5 text-xs! leading-5! text-muted-foreground! sm:flex">
              <Star size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>
                {reviewStats.ratingCount > 0
                  ? `${reviewStats.averageRating.toFixed(2).replace(".", ",")} · ${reviewStats.reviewCount} lượt đánh giá`
                  : "Chưa có đánh giá"}
              </span>
            </p>
          )}

          <div
            ref={datePickerRef}
            tabIndex={-1}
            role="group"
            aria-label="Ngày nhận và trả phòng"
            className="mt-4 scroll-mt-24 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:mt-5"
          >
            <AppDatePicker
              mode="range"
              label="Ngày nhận – trả phòng"
              placeholder="Chọn ngày lưu trú"
              value={dates}
              onChange={setDates}
              disablePastDates
              bookedRanges={bookedRanges}
              disabled={bookedRanges === undefined}
              error={availabilityError}
              className="w-full! min-w-0!"
            />
          </div>

          <p
            className={`mb-0! mt-2! text-xs! text-muted-foreground! ${
              hasDates ? "" : "hidden sm:block"
            }`}
          >
            Số đêm:{" "}
            <span className="font-semibold text-primary">
              {hasDates ? nights : "—"}
            </span>
          </p>

          <div className="mt-4 sm:mt-5">
            <label
              htmlFor={guestsId}
              className="mb-2 block text-sm font-medium"
            >
              Số khách
            </label>

            <Select<string>
              id={guestsId}
              size="large"
              value={guests}
              onChange={setGuests}
              className="h-11! w-full min-w-0"
              suffixIcon={
                <ChevronDown
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className="pointer-events-none text-muted-foreground"
                />
              }
              options={Array.from({ length: maxGuests }, (_, index) => {
                const count = index + 1;

                return {
                  value: String(count),
                  label: `${count} khách`,
                };
              })}
            />

            <p className="mb-0! mt-2! text-xs! text-muted-foreground!">
              Tối đa {maxGuests} khách
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col border-t border-border p-4 sm:border-l sm:border-t-0 sm:p-6">
          <div className="hidden sm:block">
            <h3 className="m-0! text-sm! font-semibold! text-card-foreground!">
              Chi phí lưu trú
            </h3>

            <RoomBookingPriceBreakdown price={price} pricing={pricing} />

            {!hasDates && (
              <p className="mb-0! mt-3! text-xs! leading-5! text-muted-foreground!">
                Chọn ngày nhận và trả phòng để xem tổng tiền dự kiến.
              </p>
            )}
          </div>

          <div className="sm:mt-auto sm:border-t sm:border-border sm:pt-4">
            <div
              role="status"
              aria-atomic="true"
              className="flex flex-wrap items-baseline justify-between gap-2"
            >
              {hasDates ? (
                <>
                  <span className="text-sm font-semibold">
                    Tổng tiền dự kiến
                  </span>
                  <span className="text-xl font-semibold">
                    {formatPrice(total)} USD
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground sm:hidden">
                    Chọn ngày để xem tổng giá.
                  </span>
                  <span className="hidden text-sm font-semibold sm:inline">
                    Tổng tiền dự kiến
                  </span>
                  <span className="hidden text-xl font-semibold sm:inline">
                    —
                  </span>
                </>
              )}
            </div>

            {hasDates && (
              <details className="group mt-2 sm:hidden">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-lg text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                  Xem chi tiết giá
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 group-open:rotate-180"
                  />
                </summary>

                <RoomBookingPriceBreakdown price={price} pricing={pricing} />
              </details>
            )}

            <RoomBookingConfirmModal
              open={confirmOpen}
              roomName={roomName}
              checkIn={dates.checkIn}
              checkOut={dates.checkOut}
              nights={nights}
              guests={guestCount}
              total={total}
              submitting={submitting}
              error={bookingError}
              onClose={closeConfirmation}
              onConfirm={handleConfirmBooking}
            />
            <AppButton
              type="primary"
              aria-haspopup="dialog"
              disabled={!canBook || submitting}
              onClick={openConfirmation}
              className="mt-4! h-12! w-full! rounded-xl! font-semibold! sm:mt-5!"
            >
              Đặt phòng
            </AppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
