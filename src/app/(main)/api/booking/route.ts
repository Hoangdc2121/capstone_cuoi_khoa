import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/app/(auth)/server/session";
import { BookingService } from "@/features/booking/services/booking.service";
import { apiMutationResponse } from "@/lib/api-mutation-response";
import { Fail, Ok } from "@/lib/api-response";
import { handleApiRoute } from "@/lib/handle-api-route";

type BookingApiResult = {
  statusCode?: number;
  content?: unknown;
  message?: unknown;
};

type BookingErrorOptions = {
  errorCode: string;
  errorMessage: string;
};

const fetchOptions = {
  errorCode: "BOOKING_FETCH_FAILED",
  errorMessage: "Không thể tải thông tin đặt phòng.",
  forwardUpstreamError: true,
};

const createOptions = {
  errorCode: "BOOKING_CREATE_FAILED",
  errorMessage: "Không thể đặt phòng.",
  successMessage: "Đặt phòng thành công!",
  fallbackData: null,
  forwardUpstreamError: true,
};

async function getBookingSession() {
  const cookieStore = await cookies();

  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

function parseBookingDate(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const isoDate = date.toISOString();

  return isoDate.slice(0, 10) === value ? isoDate : null;
}

function getBookingMessage(message: unknown, fallback: string): string {
  return typeof message === "string" ? message.trim() || fallback : fallback;
}

function getBookingApiError(
  res: BookingApiResult,
  options: BookingErrorOptions,
) {
  const { statusCode } = res;

  if (
    typeof statusCode !== "number" ||
    !Number.isInteger(statusCode) ||
    statusCode < 400 ||
    statusCode > 599
  ) {
    return null;
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: options.errorCode,
        message: getBookingMessage(res.message, options.errorMessage),
      },
      data: res.content ?? null,
    },
    { status: statusCode },
  );
}

export async function GET(request: Request) {
  return handleApiRoute(async () => {
    const session = await getBookingSession();

    if (!session) {
      return Fail("UNAUTHORIZED", "Vui lòng đăng nhập để xem đặt phòng.", 401);
    }

    const rawBookingId = new URL(request.url).searchParams.get("bookingId");

    if (rawBookingId === null) {
      const res = await BookingService.getByUser(session.userId);
      const apiError = getBookingApiError(res, fetchOptions);

      if (apiError) {
        return apiError;
      }

      const bookings = res.content ?? [];

      if (!Array.isArray(bookings)) {
        return Fail("INVALID_DATA", "Danh sách đặt phòng không hợp lệ.", 502);
      }

      return Ok(
        bookings,
        undefined,
        getBookingMessage(res.message, "Tải danh sách đặt phòng thành công!"),
      );
    }

    const bookingId = Number(rawBookingId);

    if (!/^[1-9]\d*$/.test(rawBookingId) || !Number.isSafeInteger(bookingId)) {
      return Fail("INVALID_BOOKING_ID", "Mã đặt phòng không hợp lệ.", 400);
    }

    const res = await BookingService.getById(bookingId);
    const apiError = getBookingApiError(res, fetchOptions);

    if (apiError) {
      return apiError;
    }

    const booking = res.content;

    if (!booking || booking.maNguoiDung !== session.userId) {
      return Fail("BOOKING_NOT_FOUND", "Không tìm thấy đơn đặt phòng.", 404);
    }

    return Ok(
      booking,
      undefined,
      getBookingMessage(res.message, "Tải thông tin đặt phòng thành công!"),
    );
  }, fetchOptions);
}

export async function POST(request: Request) {
  return handleApiRoute(async () => {
    const session = await getBookingSession();

    if (!session) {
      return Fail("UNAUTHORIZED", "Vui lòng đăng nhập để đặt phòng.", 401);
    }

    let payload: unknown;

    try {
      payload = await request.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        return Fail("INVALID_JSON", "Dữ liệu JSON không hợp lệ.", 400);
      }

      throw error;
    }

    if (
      typeof payload !== "object" ||
      payload === null ||
      Array.isArray(payload)
    ) {
      return Fail("INVALID_INPUT", "Dữ liệu đặt phòng không hợp lệ.", 400);
    }

    const input = payload as Record<string, unknown>;
    const { maPhong, soLuongKhach } = input;

    if (
      typeof maPhong !== "number" ||
      !Number.isSafeInteger(maPhong) ||
      maPhong <= 0
    ) {
      return Fail("INVALID_ROOM_ID", "Mã phòng không hợp lệ.", 400);
    }

    if (
      typeof soLuongKhach !== "number" ||
      !Number.isSafeInteger(soLuongKhach) ||
      soLuongKhach < 1
    ) {
      return Fail("INVALID_GUEST_COUNT", "Số khách phải từ 1 trở lên.", 400);
    }

    const ngayDen = parseBookingDate(input.ngayDen);
    const ngayDi = parseBookingDate(input.ngayDi);

    if (!ngayDen || !ngayDi || ngayDi <= ngayDen) {
      return Fail(
        "INVALID_BOOKING_DATES",
        "Ngày trả phòng phải sau ngày nhận phòng.",
        400,
      );
    }

    const existing = await BookingService.getAll();

    if (!Array.isArray(existing?.content)) {
      return Fail(
        "BOOKING_AVAILABILITY_UNAVAILABLE",
        "Chưa kiểm tra được lịch phòng. Vui lòng thử lại.",
        502,
      );
    }

    const checkIn = ngayDen.slice(0, 10);
    const checkOut = ngayDi.slice(0, 10);

    const hasConflict = existing.content.some(
      (booking) =>
        booking?.maPhong === maPhong &&
        checkIn < booking.ngayDi.slice(0, 10) &&
        checkOut > booking.ngayDen.slice(0, 10),
    );

    if (hasConflict) {
      return Fail(
        "BOOKING_DATE_CONFLICT",
        "Phòng đã có người đặt trong khoảng ngày này. Vui lòng chọn ngày khác.",
        409,
      );
    }

    const res = await BookingService.create({
      maPhong,
      ngayDen,
      ngayDi,
      soLuongKhach,
      maNguoiDung: session.userId,
    });

    return apiMutationResponse(res, createOptions);
  }, createOptions);
}
