import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({
      error: "Email phải là chuỗi và không được bỏ trống.",
    })
    .trim()
    .min(1, {
      error: "Vui lòng nhập email.",
    })
    .pipe(
      z.email({
        error: "Email không đúng định dạng.",
      }),
    ),

  password: z
    .string({
      error: "Mật khẩu phải là chuỗi và không được bỏ trống.",
    })
    .min(1, {
      error: "Vui lòng nhập mật khẩu.",
    }),
});

export const signUpInfoSchema = z.object({
  name: z
    .string({ error: "Vui lòng nhập họ và tên." })
    .trim()
    .min(2, { error: "Họ và tên phải có ít nhất 2 ký tự." })
    .max(100, { error: "Họ và tên không được vượt quá 100 ký tự." }),

  email: z
    .string({ error: "Vui lòng nhập email." })
    .trim()
    .min(1, { error: "Vui lòng nhập email." })
    .pipe(z.email({ error: "Email không đúng định dạng." })),

  phone: z
    .string({ error: "Vui lòng nhập số điện thoại." })
    .trim()
    .min(1, { error: "Vui lòng nhập số điện thoại." })
    .regex(/^(0|\+84)[35789]\d{8}$/, {
      error: "Vui lòng nhập số điện thoại di động Việt Nam hợp lệ.",
    }),

  birthday: z.iso.date({
    error: "Vui lòng chọn ngày sinh.",
  }),

  gender: z.boolean({
    error: "Vui lòng chọn giới tính.",
  }),
});

export const signUpSchema = signUpInfoSchema
  .extend({
    password: z
      .string({ error: "Vui lòng nhập mật khẩu." })
      .min(8, { error: "Mật khẩu phải có ít nhất 8 ký tự." })
      .regex(/[a-z]/, {
        error: "Mật khẩu phải có chữ thường.",
      })
      .regex(/[A-Z]/, {
        error: "Mật khẩu phải có chữ hoa.",
      })
      .regex(/\d/, {
        error: "Mật khẩu phải có số.",
      })
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, {
        error: "Mật khẩu phải có ký tự đặc biệt.",
      }),

    confirmPassword: z
      .string({ error: "Vui lòng xác nhận mật khẩu." })
      .min(1, { error: "Vui lòng xác nhận mật khẩu." }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
