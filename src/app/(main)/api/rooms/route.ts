import { RoomService } from "@/features/rooms/services/Room.service";
import { Fail, Ok } from "@/lib/api-response";
import { handleApiRoute } from "@/lib/handle-api-route";

export async function GET(request: Request) {
  return handleApiRoute(
    async () => {
      const { searchParams } = new URL(request.url);
      const rawDestinationId = searchParams.get("destinationId");

      let destinationId: number | undefined;

      if (rawDestinationId !== null) {
        destinationId = Number(rawDestinationId);

        if (
          !/^[1-9]\d*$/.test(rawDestinationId) ||
          !Number.isSafeInteger(destinationId)
        ) {
          return Fail(
            "INVALID_DESTINATION_ID",
            "Mã khu vực không hợp lệ.",
            400,
          );
        }
      }
      const res =
        destinationId === undefined
          ? await RoomService.getAll()
          : await RoomService.getByLocation(destinationId);

      if (!Array.isArray(res.content)) {
        return Fail(
          "INVALID_DATA",
          "Dữ liệu danh sách phòng không hợp lệ.",
          502,
        );
      }

      return Ok(res.content);
    },
    {
      errorCode: "ROOMS_FETCH_FAILED",
      errorMessage: "Không thể tải danh sách phòng.",
    },
  );
}
