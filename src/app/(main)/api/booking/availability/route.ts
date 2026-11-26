import { BookingService } from "@/features/booking/services/booking.service";
import { Fail, Ok } from "@/lib/api-response";
import { handleApiRoute } from "@/lib/handle-api-route";

export async function GET(request: Request) {
  return handleApiRoute(
    async () => {
      const rawRoomId = new URL(request.url).searchParams.get("roomId");
      const roomId = Number(rawRoomId);

      if (
        !rawRoomId ||
        !/^[1-9]\d*$/.test(rawRoomId) ||
        !Number.isSafeInteger(roomId)
      ) {
        return Fail("INVALID_ROOM_ID", "Mã phòng không hợp lệ.", 400);
      }

      const result = await BookingService.getAll();

      if (!Array.isArray(result?.content)) {
        return Fail(
          "INVALID_AVAILABILITY",
          "Chưa kiểm tra được lịch phòng. Vui lòng thử lại.",
          502,
        );
      }

      const bookedRanges = result.content
        .filter((booking) => booking?.maPhong === roomId)
        .map(({ ngayDen, ngayDi }) => ({
          checkIn: ngayDen?.slice(0, 10),
          checkOut: ngayDi?.slice(0, 10),
        }))
        .filter(
          ({ checkIn, checkOut }) =>
            checkIn && checkOut && checkIn < checkOut,
        );

      return Ok(bookedRanges);
    },
    {
      errorCode: "BOOKING_AVAILABILITY_FAILED",
      errorMessage: "Không thể tải lịch phòng.",
    },
  );
}