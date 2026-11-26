import { cookies } from "next/headers";
import { z } from "zod";

import { apiFetch, ApiFetchError } from "@/lib/api-fetch";
import { Fail, Ok } from "@/lib/api-response";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/app/(auth)/server/session";

// Chỉ lấy những trường cần dùng từ response backend.
const profileResponseSchema = z.object({
  content: z.object({
    id: z.number().int().positive(),
    email: z.string().email(),
  }),
});

export async function GET() {
  try {
    const cookieStore = await cookies();

    const sessionToken =
      cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const accessToken =
      cookieStore.get("accessToken")?.value;

    if (!sessionToken || !accessToken) {
      return Fail(
        "UNAUTHENTICATED",
        "Bạn chưa đăng nhập.",
        401,
      );
    }

    // Kiểm tra phiên do Next.js ký.
    const session = await verifySessionToken(sessionToken);

    if (!session) {
      return Fail(
        "SESSION_EXPIRED",
        "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
        401,
      );
    }

    // Lấy ID từ phiên đã xác minh, không nhận ID từ trình duyệt.
    const response = await apiFetch<unknown>(
      `/api/users/${session.userId}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const result = profileResponseSchema.safeParse(response);

    if (
      !result.success ||
      result.data.content.id !== session.userId
    ) {
      return Fail(
        "INVALID_RESPONSE",
        "Backend trả về thông tin tài khoản không hợp lệ.",
        502,
      );
    }

    // Không trả mật khẩu, token hoặc toàn bộ hồ sơ.
    return Ok(
      { email: result.data.content.email },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof ApiFetchError) {
      if (error.status === 404) {
        return Fail(
          "ACCOUNT_NOT_FOUND",
          "Tài khoản không còn tồn tại.",
          401,
        );
      }

      return Fail(
        "PROFILE_ERROR",
        error.message,
        error.status,
      );
    }

    return Fail(
      "INTERNAL_ERROR",
      "Không thể kiểm tra phiên đăng nhập, vui lòng thử lại.",
      500,
    );
  }
}