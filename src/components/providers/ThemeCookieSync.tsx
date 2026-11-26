"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeCookieSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;

    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie =
      `ui-theme=${resolvedTheme}; Path=/; Max-Age=31536000; SameSite=Lax` +
      secure;
  }, [resolvedTheme]);

  return null;
}
