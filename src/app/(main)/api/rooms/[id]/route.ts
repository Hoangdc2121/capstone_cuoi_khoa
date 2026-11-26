import { RoomService } from "@/features/rooms/services/Room.service";
import { Fail, Ok } from "@/lib/api-response";
import { handleApiRoute } from "@/lib/handle-api-route";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  return handleApiRoute(
    async () => {
      const { id } = await params;
      const roomId = Number(id);

      if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(roomId)) {
        return Fail("INVALID_ROOM_ID", "Mã phòng không hợp lệ.", 400);
      }
      const res = await RoomService.getById(roomId);
      const room = res.content;

      if (
        typeof room !== "object" ||
        room === null ||
        Array.isArray(room) ||
        room.id !== roomId
      ) {
        return Fail(
          "INVALID_DATA",
          "Dữ liệu chi tiết phòng không hợp lệ.",
          502,
        );
      }

      return Ok(room);
    },

    {
      errorCode: "ROOM_DETAIL_FETCH_FAILED",
      errorMessage: "Không thể tải chi tiết phòng.",
    },
  );
}
