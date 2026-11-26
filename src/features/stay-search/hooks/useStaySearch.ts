"use client";

import { useState } from "react";
import type { StaySearchErrors } from "../types/search.types";
import { getTodayString, isValidDate } from "../utils/date.utils";

type StaySearchInitialValues = {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
};

export default function useStaySearch(
  initialValues: StaySearchInitialValues = {},
) {
  const [checkIn, setCheckIn] = useState(initialValues.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(initialValues.checkOut ?? "");
  const [guests, setGuests] = useState(initialValues.guests ?? "2");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [errors, setErrors] = useState<StaySearchErrors>({});

  const hasErrors = Object.values(errors).some(Boolean);

  function clearError(field: keyof StaySearchErrors) {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function changeGuests(step: number) {
    setGuests((current) => {
      const parsed = Number(current);
      const valid = Number.isSafeInteger(parsed) && parsed >= 1;
      const next = (valid ? parsed : 1) + step;

      return String(Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, next)));
    });

    clearError("guests");
  }

  function validate() {
    const nextErrors: StaySearchErrors = {};
    const guestCount = Number(guests);

    if (!checkIn) {
      nextErrors.checkIn = "Vui lòng chọn ngày nhận phòng.";
    } else if (!isValidDate(checkIn)) {
      nextErrors.checkIn = "Ngày nhận phòng không hợp lệ.";
    } else if (checkIn < getTodayString()) {
      nextErrors.checkIn = "Ngày nhận phòng không được ở quá khứ.";
    }

    if (!checkOut) {
      nextErrors.checkOut = "Vui lòng chọn ngày trả phòng.";
    } else if (!isValidDate(checkOut)) {
      nextErrors.checkOut = "Ngày trả phòng không hợp lệ.";
    } else if (isValidDate(checkIn) && checkOut <= checkIn) {
      nextErrors.checkOut = "Ngày trả phòng phải sau ngày nhận phòng.";
    }

    if (!guests.trim() || !Number.isSafeInteger(guestCount) || guestCount < 1) {
      nextErrors.guests = "Số khách phải là số nguyên từ 1 trở lên.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  return {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,

    guests,
    setGuests,
    guestsOpen,
    setGuestsOpen,
    changeGuests,

    errors,
    hasErrors,
    clearError,
    validate,
  };
}
