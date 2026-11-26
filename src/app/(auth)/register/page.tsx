import type { Metadata } from "next";
import RegisterForm from "../components/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký | Ở Đâu",
  description: "Đăng ký tài khoản Ở Đâu.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
