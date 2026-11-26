import { ApiFetchError } from "@/lib/api-fetch";
import { Fail, Ok } from "@/lib/api-response";
import { AuthService } from "@/app/(auth)/service/Auth.service";
import { signUpSchema } from "@/validations/auth.schema";

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();

    const result = signUpSchema.safeParse(payload);

    if (!result.success) {
      return Fail(
        "INVALID_INPUT",
        result.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
        400,
        result.error.issues,
      );
    }

    const values = result.data;

    const res = await AuthService.signUp({
      id: 0,
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      birthday: values.birthday,
      gender: values.gender,

      role: "USER",
    });

    // không trả lại mật khẩu hoặc toàn bộ dữ liệu

    return Ok(null, undefined, res.message || "Đăng ký thành công!");
  } catch (error) {
    if (error instanceof ApiFetchError) {
      return Fail("SIGN_UP_ERROR", error.message, error.status);
    }

    if (error instanceof SyntaxError) {
      return Fail("INVALID_JSON", "Dữ liệu JSON không hợp lệ.", 400);
    }

    return Fail("INTERNAL_ERROR", "Không thể đăng ký, vui lòng thử lại.", 500);
  }
}
