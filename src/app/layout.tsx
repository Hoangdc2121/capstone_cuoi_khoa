import type { Metadata } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import "@/styles/antd.css";
import "@/styles/button.css";
import "@/styles/link.css";
import "@/styles/hero.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdProvider from "@/components/providers/AntdProvider";
import ThemeCookieSync from "@/components/providers/ThemeCookieSync";
import StoreProvider from "@/redux/StoreProvider";
import { cookies } from "next/headers";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ở ĐÂU — Tìm một nơi, mở một hành trình",
  description:
    "Khám phá điểm đến và tìm chỗ ở cho hành trình tiếp theo của bạn.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();

  const initialTheme =
    cookieStore.get("ui-theme")?.value === "dark" ? "dark" : "light";

  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${bricolageGrotesque.variable} ${
        initialTheme === "dark" ? "dark" : ""
      } h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AntdRegistry>
          <ThemeProvider
            attribute="class"
            defaultTheme={initialTheme}
            enableSystem={false}
            disableTransitionOnChange
          >
            <ThemeCookieSync />

            <AntdProvider initialTheme={initialTheme}>
              <StoreProvider>{children}</StoreProvider>
            </AntdProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
