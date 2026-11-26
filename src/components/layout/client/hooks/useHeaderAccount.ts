import { useAppSelector } from "@/redux/hooks";

export default function useHeaderAccount() {
  const { user, status } = useAppSelector((state) => state.auth);

  const authenticated = status === "authenticated" && user !== null;

  return {
    authenticated,
    checking: status === "checking",
    accountHref: authenticated ? "/profile" : "/login",
    accountLabel: authenticated ? "Tài khoản" : "Đăng nhập",
  };
}