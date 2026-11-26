import type { Metadata } from "next";
import LoginForm from "../components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập | Ở Đâu",
  description: "Đăng nhập tài khoản Ở Đâu.",
};

export default function LoginPage() {
  return <LoginForm />;
}
