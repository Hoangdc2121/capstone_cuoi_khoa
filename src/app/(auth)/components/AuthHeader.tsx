import Link from "next/link";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";

export default function AuthHeader() {
  return (
    <section>
      {/* Mobile và tablet */}
      <header className="relative h-36 shrink-0 overflow-hidden sm:h-44 lg:hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <img
            src="/img/light_auth.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 dark:opacity-0"
          />

          <img
            src="/img/dark_auth.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-700 dark:opacity-100"
          />
        </div>

        <Link
          href="/"
          aria-label="Ở Đâu — Về trang chủ"
          className="group absolute left-0 top-0 rounded-br-2xl bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <img
            src="/img/logo.png"
            alt="Ở Đâu"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="absolute right-3 top-3">
          <AnimatedThemeToggle />
        </div>
      </header>

      {/* Desktop */}
      <header className="hidden items-center justify-between gap-4 lg:flex">
        <Link
          href="/"
          aria-label="Ở Đâu — Về trang chủ"
          className="group inline-flex shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <img
            src="/img/logo.png"
            alt="Ở Đâu"
            className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <AnimatedThemeToggle />
      </header>
    </section>
  );
}
