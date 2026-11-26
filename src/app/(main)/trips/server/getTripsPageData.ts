import "server-only";

import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/app/(auth)/server/session";
import { BookingService } from "@/features/booking/services/booking.service";
import type { BookingType } from "@/features/booking/types/booking.types";
import { RoomService } from "@/features/rooms/services/Room.service";
import type { RoomType } from "@/features/rooms/types/room.types";

import type { TripStatus } from "../constants/trips";

type TripRoom = Pick<RoomType, "tenPhong" | "hinhAnh">;

type TripsPageData = {
  isSignedIn: boolean;
  hasLoadError: boolean;
  bookings: BookingType[];
  roomsById: Map<number, TripRoom>;
};

const vietnamDateFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Ho_Chi_Minh",
});

export async function getTripsPageData(
  activeStatus: TripStatus,
): Promise<TripsPageData> {
  const roomsById = new Map<number, TripRoom>();
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
  );

  if (!session) {
    return {
      isSignedIn: false,
      hasLoadError: false,
      bookings: [],
      roomsById,
    };
  }

  let bookings: BookingType[] | undefined;

  try {
    const result = await BookingService.getByUser(session.userId);

    if (
      result &&
      result.statusCode >= 200 &&
      result.statusCode < 300 &&
      Array.isArray(result.content)
    ) {
      bookings = result.content;
    }
  } catch {
    // TripsContent hiển thị lỗi khi không tải được danh sách.
  }

  if (!bookings) {
    return {
      isSignedIn: true,
      hasLoadError: true,
      bookings: [],
      roomsById,
    };
  }

  const today = vietnamDateFormatter.format(new Date());

  const visibleBookings = bookings
    .filter(({ ngayDen, ngayDi }) => {
      const checkIn = ngayDen.slice(0, 10);
      const checkOut = ngayDi.slice(0, 10);
      const status =
        today < checkIn ? "upcoming" : today < checkOut ? "current" : "past";

      return status === activeStatus;
    })
    .sort((a, b) =>
      activeStatus === "past"
        ? b.ngayDi.localeCompare(a.ngayDi)
        : a.ngayDen.localeCompare(b.ngayDen),
    );

  const roomIds = [...new Set(visibleBookings.map(({ maPhong }) => maPhong))];

  const roomResults = await Promise.allSettled(
    roomIds.map(async (roomId) => {
      const result = await RoomService.getById(roomId);
      return { roomId, room: result?.content };
    }),
  );

  for (const result of roomResults) {
    if (result.status === "fulfilled" && result.value.room) {
      const { roomId, room } = result.value;

      roomsById.set(roomId, {
        tenPhong: room.tenPhong,
        hinhAnh: room.hinhAnh,
      });
    }
  }

  return {
    isSignedIn: true,
    hasLoadError: false,
    bookings: visibleBookings,
    roomsById,
  };
}