import { Fail, Ok } from "@/lib/api-response";
import { handleApiRoute } from "@/lib/handle-api-route";

import { DestinationService } from "../../../../features/destinations/service/destination.service";

export async function GET() {
  return handleApiRoute(
    async () => {
      const response = await DestinationService.getAll();

      if (!Array.isArray(response.content)) {
        return Fail(
          "INVALID_DATA",
          "Dữ liệu danh sách địa điểm không hợp lệ.",
          502,
        );
      }

      return Ok(response.content);
    },
    {
      errorCode: "DESTINATIONS_FETCH_FAILED",
      errorMessage: "Không thể tải danh sách địa điểm.",
    },
  );
}