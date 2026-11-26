import { Fail, Ok } from "@/lib/api-response";
import { SESSION_COOKIE_NAME } from "@/app/(auth)/server/session";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies()

        cookieStore.delete("accessToken");
        cookieStore.delete(SESSION_COOKIE_NAME);

    return Ok(null, undefined, "Đăng xuất thành công!");
    } catch (error) {
        return Fail(
            "LOGOUT_ERROR",
            "Đăng xuất thất bại, vui lòng thử lại.",
            500,
        )
    }
}