"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { App, ConfigProvider, theme, type ThemeConfig } from "antd";
import { useTheme } from "next-themes";
import NotificationProvider from "./NotificationProvider";

type AntdProviderProps = {
  children: ReactNode;
  initialTheme: "light" | "dark";
};

export default function AntdProvider({
  children,
  initialTheme,
}: AntdProviderProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Giữ lần render đầu đồng nhất giữa server và trình duyệt.
  const currentTheme = mounted ? (resolvedTheme ?? initialTheme) : initialTheme;

  const isDark = currentTheme === "dark";

  const antdTheme = useMemo<ThemeConfig>(
    () => ({
      // Dùng CSS variables khi chuyển theme.
      cssVar: {
        key: "o-dau",
      },

      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,

      // Cấu hình chung cho các component Ant Design.
      token: {
        colorPrimary: "#E63A54",

        fontFamily: "var(--font-be-vietnam-pro), sans-serif",

        borderRadius: 12,

        // Nền trang, component và phần nổi.
        colorBgLayout: isDark ? "#171315" : "#FFFFFF",
        colorBgContainer: isDark ? "#231C1F" : "#FFFFFF",
        colorBgElevated: isDark ? "#231C1F" : "#FFFFFF",

        // Chữ chính và chữ phụ.
        colorText: isDark ? "#FFFFFF" : "#252025",
        colorTextSecondary: isDark ? "#C5B8BD" : "#676767",

        // Viền và màu lỗi.
        colorBorder: isDark ? "#49363E" : "#ECDDE0",
        colorError: isDark ? "#FF938A" : "#B42318",
      },

      // Cấu hình riêng cho Button.
      components: {
        Button: {
          // Màu nút chính.
          colorPrimary: "#E63A54",
          colorPrimaryHover: "#AD2C3F",
          colorPrimaryActive: "#902435",

          // Chữ trên nút chính.
          primaryColor: "#FFFFFF",
          colorTextLightSolid: "#FFFFFF",

          // Kích thước.
          controlHeight: 40,
          controlHeightLG: 48,

          // Độ đậm và khoảng cách ngang.
          fontWeight: 600,
          paddingInline: 20,
          paddingInlineLG: 24,

          // Bỏ bóng mặc định.
          primaryShadow: "none",
          defaultShadow: "none",
        },
      },
    }),
    [isDark],
  );

  return (
    <ConfigProvider theme={antdTheme}>
      <App>
        <NotificationProvider>{children}</NotificationProvider>
      </App>
    </ConfigProvider>
  );
}
