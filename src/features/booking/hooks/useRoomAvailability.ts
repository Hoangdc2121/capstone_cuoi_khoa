"use client";

import { useEffect, useState } from "react";

import type { DateRangeValue } from "@/components/common/AppDatePicker";

type AvailabilityResult = {
  roomId: number;
  bookedRanges?: DateRangeValue[];
  availabilityError?: string;
};

export default function useRoomAvailability(roomId: number) {
  const [availability, setAvailability] = useState<AvailabilityResult>();

  useEffect(() => {
    const controller = new AbortController();

    async function loadAvailability() {
      try {
        const response = await fetch(
          `/api/booking/availability?roomId=${roomId}`,
          { signal: controller.signal, cache: "no-store" },
        );
        const result = await response.json();

        if (
          !response.ok ||
          result?.success !== true ||
          !Array.isArray(result.data)
        ) {
          throw new Error("Không thể tải lịch phòng.");
        }

        if (!controller.signal.aborted) {
          setAvailability({ roomId, bookedRanges: result.data });
        }
      } catch {
        if (!controller.signal.aborted) {
          setAvailability({
            roomId,
            availabilityError: "Chưa tải được lịch phòng. Vui lòng tải lại trang.",
          });
        }
      }
    }

    void loadAvailability();
    return () => controller.abort();
  }, [roomId]);

  const currentAvailability =
    availability?.roomId === roomId ? availability : undefined;

  return {
    bookedRanges: currentAvailability?.bookedRanges,
    availabilityError: currentAvailability?.availabilityError,
  };
}