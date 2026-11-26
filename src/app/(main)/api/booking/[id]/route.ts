import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/app/(auth)/server/session";
import { BookingService } from "@/features/booking/services/booking.service";
import { apiMutationResponse } from "@/lib/api-mutation-response";
import { Fail } from "@/lib/api-response";
import { handleApiRoute } from "@/lib/handle-api-route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateOptions = {
  fallbackData: null,
  successMessage: "Cập nhật đơn đặt phòng thành công!",
  errorCode: "BOOKING_UPDATE_FAILED",
  errorMessage: "Không thể cập nhật đơn đặt phòng.",
  forwardUpstreamError: true,
};

const deleteOptions = {
  successMessage: "Xóa đơn đặt phòng thành công!",
  errorCode: "BOOKING_DELETE_FAILED",
  errorMessage: "Không thể xóa đơn đặt phòng.",
  forwardUpstreamError: true,
};

function parseBookingId(id: string): number | null {
  const bookingId = Number(id);

  return /^[1-9]\d*$/.test(id) && Number.isSafeInteger(bookingId)
    ? bookingId
    : null;
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

async function getOwnedBooking(bookingId: number) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
  );

  if (!session) {
    return {
      ok: false,
      response: Fail(
        "UNAUTHORIZED",
        "Vui lòng đăng nhập để thực hiện thao tác này.",
        401,
      ),
    } as const;
  }

  const { content: booking } = await BookingService.getById(bookingId);

  if (!booking || booking.maNguoiDung !== session.userId) {
    return {
      ok: false,
      response: Fail("BOOKING_NOT_FOUND", "Không tìm thấy đơn đặt phòng.", 404),
    } as const;
  }

  return {
    ok: true,
    booking,
    userId: session.userId,
  } as const;
}

export async function PUT(request: Request, { params }: RouteContext) {
  return handleApiRoute(async () => {
    const { id } = await params;
    const bookingId = parseBookingId(id);

    if (bookingId === null) {
      return Fail("INVALID_BOOKING_ID", "Mã đặt phòng không hợp lệ.", 400);
    }

    const result = await getOwnedBooking(bookingId);

    if (!result.ok) {
      return result.response;
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
    const ngayDen = parseBookingDate(input.ngayDen);
    const ngayDi = parseBookingDate(input.ngayDi);
    const { soLuongKhach } = input;

    if (!ngayDen || !ngayDi || ngayDi <= ngayDen) {
      return Fail(
        "INVALID_BOOKING_DATES",
        "Chọn ngày nhận phòng hợp lệ và ngày trả phòng sau ngày nhận.",
        400,
      );
    }

    if (
      typeof soLuongKhach !== "number" ||
      !Number.isSafeInteger(soLuongKhach) ||
      soLuongKhach < 1
    ) {
      return Fail("INVALID_GUEST_COUNT", "Số khách phải từ 1 trở lên.", 400);
    }

    const res = await BookingService.update(bookingId, {
      maPhong: result.booking.maPhong,
      maNguoiDung: result.userId,
      ngayDen,
      ngayDi,
      soLuongKhach,
    });

    return apiMutationResponse(res, updateOptions);
  }, updateOptions);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  return handleApiRoute(async () => {
    const { id } = await params;
    const bookingId = parseBookingId(id);

    if (bookingId === null) {
      return Fail("INVALID_BOOKING_ID", "Mã đặt phòng không hợp lệ.", 400);
    }

    const result = await getOwnedBooking(bookingId);

    if (!result.ok) {
      return result.response;
    }

    const res = await BookingService.delete(bookingId);

    return apiMutationResponse(res, {
      ...deleteOptions,
      fallbackData: { id: bookingId },
    });
  }, deleteOptions);
}
