import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/app/(auth)/server/session";
import { CommentService } from "@/features/rooms/services/Comment.service";
import { Fail, Ok } from "@/lib/api-response";
import { handleApiRoute } from "@/lib/handle-api-route";
import { apiMutationResponse } from "@/lib/api-mutation-response";

const createOptions = {
  errorCode: "COMMENT_CREATE_FAILED",
  errorMessage: "Không thể gửi bình luận.",
  successMessage: "Gửi bình luận thành công!",
  fallbackData: null,
  forwardUpstreamError: true,
};

export async function GET(request: Request) {
  return handleApiRoute(
    async () => {
      const { searchParams } = new URL(request.url);
      const rawRoomId = searchParams.get("roomId");

      let roomId: number | undefined;

      if (rawRoomId !== null) {
        roomId = Number(rawRoomId);

        if (!/^[1-9]\d*$/.test(rawRoomId) || !Number.isSafeInteger(roomId)) {
          return Fail("INVALID_ROOM_ID", "Mã phòng không hợp lệ.", 400);
        }
      }

      const result =
        roomId === undefined
          ? await CommentService.getAll()
          : await CommentService.getByRoomComments(roomId);

      if (!Array.isArray(result.content)) {
        return Fail(
          "INVALID_DATA",
          "Dữ liệu danh sách bình luận không hợp lệ.",
          502,
        );
      }

      return Ok(result.content);
    },
    {
      errorCode: "COMMENTS_FETCH_FAILED",
      errorMessage: "Không thể tải danh sách bình luận.",
    },
  );
}

export async function POST(request: Request) {
  return handleApiRoute(async () => {
    const cookieStore = await cookies();
    const session = await verifySessionToken(
      cookieStore.get(SESSION_COOKIE_NAME)?.value,
    );
    const token = cookieStore.get("accessToken")?.value;

    if (!session || !token) {
      return Fail("UNAUTHORIZED", "Vui lòng đăng nhập để gửi bình luận.", 401);
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
      return Fail("INVALID_INPUT", "Dữ liệu bình luận không hợp lệ.", 400);
    }

    const input = payload as Record<string, unknown>;
    const { maPhong, saoBinhLuan } = input;

    if (
      typeof maPhong !== "number" ||
      !Number.isSafeInteger(maPhong) ||
      maPhong <= 0
    ) {
      return Fail("INVALID_ROOM_ID", "Mã phòng không hợp lệ.", 400);
    }

    const noiDung =
      typeof input.noiDung === "string" ? input.noiDung.trim() : "";

    if (!noiDung || noiDung.length > 2000) {
      return Fail(
        "INVALID_CONTENT",
        "Nội dung bình luận phải có từ 1 đến 2000 ký tự.",
        400,
      );
    }

    if (
      typeof saoBinhLuan !== "number" ||
      !Number.isInteger(saoBinhLuan) ||
      saoBinhLuan < 1 ||
      saoBinhLuan > 5
    ) {
      return Fail("INVALID_RATING", "Vui lòng chọn số sao từ 1 đến 5.", 400);
    }

    const result = await CommentService.create(
      {
        maPhong,
        maNguoiBinhLuan: session.userId,
        ngayBinhLuan: new Date().toISOString(),
        noiDung,
        saoBinhLuan,
      },
      token,
    );

    return apiMutationResponse(result, createOptions);
  }, createOptions);
}
