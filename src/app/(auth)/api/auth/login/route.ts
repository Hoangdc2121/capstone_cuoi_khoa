import { ApiFetchError } from "@/lib/api-fetch";
import { Fail, Ok } from "@/lib/api-response";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/app/(auth)/server/session";
import { AuthService } from "@/app/(auth)/service/Auth.service";
import { signInSchema } from "@/validations/auth.schema";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();

    const result = signInSchema.safeParse(payload);

    if (!result.success) {
      return Fail(
        "INVALID_INPUT",
        result.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
        400,
        result.error.issues,
      );
    }

    const res = await AuthService.signIn(result.data);

    // Phần kiểm tra token giữ nguyên.
    const token = res.content?.token;
    const user = res.content?.user;

    if (
      typeof token !== "string" ||
      !token ||
      !user ||
      !Number.isSafeInteger(user.id) ||
      user.id <= 0 ||
      typeof user.email !== "string" ||
      !user.email
    ) {
      return Fail(
        "INVALID_RESPONSE",
        "Backend trả về thông tin đăng nhập không hợp lệ.",
        502,
      );
    }

    // Chỉ đọc thời hạn của token vừa nhận trực tiếp từ backend.
    let backendExpiration: number | undefined;

    try {
      backendExpiration = decodeJwt(token).exp;
    } catch {
      return Fail(
        "INVALID_RESPONSE",
        "Token backend không đúng định dạng.",
        502,
      );
    }

    const now = Math.floor(Date.now() / 1000);

    if (
      typeof backendExpiration !== "number" ||
      !Number.isFinite(backendExpiration) ||
      backendExpiration <= now
    ) {
      return Fail(
        "INVALID_RESPONSE",
        "Token backend không có thời hạn hợp lệ.",
        502,
      );
    }

    // Chọn thời hạn sớm hơn: token backend hoặc 24 giờ.
    const expiresAt = new Date(
      Math.min(backendExpiration, now + SESSION_MAX_AGE) * 1000,
    );

    // Tạo phiên riêng của Next.js trước khi ghi cookie.
    const sessionToken = await createSessionToken(user.id, expiresAt);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      expires: expiresAt,
    };

    const cookieStore = await cookies();

    // Token dùng để gọi backend Cybersoft.
    cookieStore.set("accessToken", token, cookieOptions);

    // Phiên dùng để nhận diện người dùng ở Next.js.
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, cookieOptions);

    return Ok({ email: user.email }, undefined, "Đăng nhập thành công!");
  } catch (error) {
    if (error instanceof ApiFetchError) {
      return Fail("AUTH_ERROR", error.message, error.status);
    }

    if (error instanceof SyntaxError) {
      return Fail("INVALID_JSON", "Dữ liệu JSON không hợp lệ.", 400);
    }

    return Fail(
      "INTERNAL_ERROR",
      "Không thể đăng nhập, vui lòng thử lại.",
      500,
    );
  }
}
