"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { DateRangeValue } from "@/components/common/AppDatePicker";

import { createBooking } from "../store/bookingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { notifySuccess, notifyWarning } from "@/utils/notification";

type UseRoomBookingOptions = {
  roomId: number;
  maxGuests: number;
  dates: DateRangeValue;
  guests: string;
  hasDates: boolean;
};

export default function useRoomBooking({
  roomId,
  maxGuests,
  dates,
  guests,
  hasDates,
}: UseRoomBookingOptions) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const submitting = useAppSelector(
    (state) => state.booking.createStatus === "loading",
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingError, setBookingError] = useState<string>();

  const guestCount = Number(guests);
  const canBook =
    hasDates &&
    Number.isSafeInteger(guestCount) &&
    guestCount >= 1 &&
    guestCount <= maxGuests;

  function openConfirmation() {
    if (!canBook || submitting) return;

    setBookingError(undefined);
    setConfirmOpen(true);
  }

  function closeConfirmation() {
    if (submitting) return;

    setConfirmOpen(false);
  }

  async function handleConfirmBooking() {
    if (!canBook || submitting) return;

    setBookingError(undefined);

    try {
      const message = await dispatch(
        createBooking({
          maPhong: roomId,
          ngayDen: dates.checkIn,
          ngayDi: dates.checkOut,
          soLuongKhach: guestCount,
        }),
      ).unwrap();

      setConfirmOpen(false);

      if (message) {
        notifySuccess(message);
      }

    //   router.push("/trips?booked=1");
    } catch (error) {
      if (error === "Vui lòng đăng nhập để đặt phòng.") {
        notifyWarning(error);
        return;
      }

      setBookingError(
        typeof error === "string"
          ? error
          : "Không thể xác nhận kết quả đặt phòng.",
      );
    }
  }

  return {
    confirmOpen,
    submitting,
    bookingError,
    guestCount,
    canBook,
    openConfirmation,
    closeConfirmation,
    handleConfirmBooking,
  };
}
