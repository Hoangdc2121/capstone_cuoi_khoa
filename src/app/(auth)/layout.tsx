import type { ReactNode } from "react";
import AuthBackground from "./components/AuthBackground";
import AuthHeader from "./components/AuthHeader";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative isolate min-h-dvh bg-background text-foreground lg:bg-transparent">
      <AuthBackground />

      <div className="flex min-h-dvh w-full flex-col lg:items-start lg:p-8">
        <section
          aria-label="Tài khoản Ở Đâu"
          className="flex w-full min-w-0 flex-1 flex-col lg:min-h-[calc(100dvh-4rem)] lg:max-w-115 lg:flex-none lg:rounded-3xl lg:border lg:border-white/25 lg:bg-white/35 lg:px-10 lg:py-6 lg:shadow-lg lg:shadow-black/5 lg:backdrop-blur-xl lg:dark:border-white/10 lg:dark:bg-background/45"
        >
          <AuthHeader />

          <div className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col px-4 pt-6 pb-6 sm:px-6 lg:max-w-none lg:justify-center lg:px-0 lg:py-6">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
